// text.js — pure, dependency-free text helpers for the chat worker.
// Split out so tests.js can import them directly (the Worker entrypoint may
// only export `default` + Durable-Object classes, so helpers live here).
//
// stripInlineRefs removes the model's inline citation artifacts so the UI
// shows clean prose. The source chips (added separately by the widget) are
// the canonical citation; bracketed "[1. x]" / "[Title | Site - URL]" cites
// are duplicates the model is told not to emit, and this is the safety net.

'use strict';

// Removes:
//   [1. Summary]   [2) Notes]   [12]          — numbered citation labels
//   [Title | AppoSight - https://...]          — bracketed "Title | Site - URL"
//   [anything containing an http(s) URL]       — any bracketed URL citation
// Leaves OTHER bracketed text untouched (e.g. [redacted], code, [v2]).
// NB: inside a char class the `]` MUST be escaped as `\]` — `[^]\n]` is
// parsed by JS as "any char" (negated-empty special case) + literal newline +
// `]`, which demands a newline that is never there and silently matches nothing.
export function stripInlineRefs(t) {
  if (typeof t !== 'string' || !t) return t;
  let s = t;
  // numbered citation labels: [1. x] [2) x]  (digit, then . or ), then label)
  s = s.replace(/\[[0-9]{1,3}\s*[.)]\s*[^\]\n]{0,80}\]/g, ' ');
  // bare numbered cite: [1]
  s = s.replace(/\[[0-9]{1,3}\]/g, ' ');
  // any bracketed content that contains a URL (covers [Title | AppoSight - https://...])
  s = s.replace(/\[[^\]\n]*https?:\/\/[^\]\n]*\]/g, ' ');
  // collapse the double spaces the removals left behind
  s = s.replace(/ {2,}/g, ' ');
  return s.trim();
}

// Streaming-safe: given the accumulated (already-stripped) answer text,
// return the longest prefix we can safely emit, holding back a trailing
// fragment that could be the START of a citation not yet completed (an
// unclosed '['). Without this, a delta ending "[1" would leak the partial
// "[1" before the next delta completes "[1. Summary]" (which we then can't
// un-send). Bounded so we never stall the stream on a real literal bracket.
export function safePrefix(s) {
  if (typeof s !== 'string' || !s) return s;
  const idx = s.lastIndexOf('[');
  if (idx === -1) return s;
  const after = s.slice(idx + 1);
  if (!after.includes(']')) {
    // unclosed '[' -> could be a partial citation; hold back only if it is
    // still short (likely still forming). Long -> treat as literal bracket.
    return after.length <= 20 ? s.slice(0, idx) : s;
  }
  return s; // closed bracket: if it were a citation, stripInlineRefs removed it
}

// ---- IMP7: PII redaction for question logs -------------------------------
// The q_ log stores question text for lead follow-up, but per policy emails,
// phone numbers, and long digit strings (card numbers, SSNs, order/IDs)
// must never be persisted in the clear. redactPII() is applied inside
// logQuestion() — the single choke point for EVERY q_ write (canned path,
// non-ok outcome, buying-intent ok) — so the model prompt, t_ timing logs,
// and console output are unaffected; only the persisted question text is
// redacted. Tokens are short, fixed, and unambiguous.
// Order matters: emails first (their local/domain parts contain digit runs
// that the later passes would otherwise mis-token), then phones, then long
// digit runs (8+ digits, with optional single space/dash separators — this
// also catches 16-digit card numbers and 123-45-6789 style SSNs).
export function redactPII(t) {
  if (typeof t !== 'string' || !t) return t;
  let s = String(t);
  s = s.replace(/[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g, '[EMAIL]');
  s = s.replace(/(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g, '[PHONE]');
  s = s.replace(/\b\d(?:[\s-]?\d){7,}\b/g, '[DIGITS]');
  return s;
}

export default { stripInlineRefs, safePrefix, redactPII };
