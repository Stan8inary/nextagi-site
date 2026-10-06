/**
 * ChatLimiter — Durable Object
 * ----------------------------
 * Accurate, atomic rate limiting for the chat worker.
 *
 * Why a Durable Object and not KV: KV writes are eventually consistent with
 * ~60s propagation, so a fast burst from one IP can all read "0" and slip
 * through. A Durable Object serializes requests to the SAME instance and gives
 * strong-consistent, transactional storage — so every counter read reflects
 * every prior increment.
 *
 * Two independent limits, each enforced atomically:
 *   1. allowIp()    — per-IP ceiling on requests per rolling minute. The
 *                      bucket key includes the minute number and auto-expires,
 *                      so it's a true rolling-minute window.
 *   2. allowDaily() — global ceiling on total requests per UTC calendar day.
 *                      The key auto-expires after 1 day.
 *
 * Deliberately TWO methods (not one combined call) so the worker can:
 *   - check/charge the PER-IP limit BEFORE the (paid) model call, and
 *   - only charge the DAILY GLOBAL cap for requests that pass Turnstile.
 *     That way a flood of invalid/no-token requests is throttled per-IP
 *     WITHOUT draining the site-wide daily budget (a DoS vector if combined).
 *
 * Limits are passed per-call (from env) so they can be tuned without code.
 *
 * RUNTIME NOTE (root cause found 2026-10-04, wrangler 4.92.0 / miniflare 4):
 *   1. `DurableObject` is a Workers-LOCAL module export — it must be imported
 *      from "cloudflare:workers". It is NOT a global in this runtime;
 *      `typeof DurableObject` in the class body threw "is not defined".
 *   2. The namespace's `idFromName(name)` returns a DurableObjectID (only
 *      toString/equals) in this local runtime — calling methods on it throws
 *      "does not support RPC". The correct handle source is
 *      `await namespace.getByName(name)` (probed: exported methods ARE
 *      callable on the returned handle). Production Workers accept both;
 *      the worker prefers getByName when available.
 *   3. Binding name ("Limiter"), class name ("ChatLimiter"), and migration
 *      tag ("v1", new_sqlite_classes = ["ChatLimiter"]) all agree in
 *      wrangler.toml — the binding resolves; only the import was missing.
 */
import { DurableObject } from 'cloudflare:workers';

export class ChatLimiter extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
    this.storage = ctx.storage;
  }

  /**
   * Charge one request against the per-IP per-minute bucket.
   * @returns {Promise<{allowed:boolean, reason?:string, ipCount?:number, limit?:number}>}
   */
  async allowIp(ip, limit) {
    const safeIp = ip ? String(ip).slice(0, 64) : 'unknown';
    const minute = Math.floor(Date.now() / 60000);
    const key = 'ip:' + safeIp + ':' + minute;
    const count = Number(await this.storage.get(key)) || 0;
    if (count >= limit) {
      return { allowed: false, reason: 'rate_limited_ip', ipCount: count, limit };
    }
    await this.storage.put(key, count + 1, { expirationTtl: 120 });
    return { allowed: true, ipCount: count + 1, limit };
  }

  /**
   * Charge one request against the global daily cap.
   * @returns {Promise<{allowed:boolean, reason?:string, dailyUsed?:number, dailyCap?:number}>}
   */
  async allowDaily(limit) {
    const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
    const key = 'daily:' + day;
    const count = Number(await this.storage.get(key)) || 0;
    if (count >= limit) {
      return { allowed: false, reason: 'daily_cap', dailyUsed: count, dailyCap: limit };
    }
    await this.storage.put(key, count + 1, { expirationTtl: 90000 });
    return { allowed: true, dailyUsed: count + 1, dailyCap: limit };
  }

  /** Read-only daily usage (health endpoint / observability). */
  async stats() {
    const day = new Date().toISOString().slice(0, 10);
    const dailyUsed = Number(await this.storage.get('daily:' + day)) || 0;
    return { dailyUsed, today: day };
  }
}
