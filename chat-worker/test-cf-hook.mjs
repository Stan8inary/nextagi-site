// TEST-ONLY ESM hook: resolve "cloudflare:workers" (a Workers-local module
// that Node cannot natively import) to a minimal stub providing the
// `DurableObject` base class. Loaded only when CHATWORKER_TEST_STUB_CF=1 —
// never at runtime in wrangler dev (which resolves the real module itself).
import { registerHooks } from 'node:module';

class DurableObject {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; this.storage = ctx && ctx.storage; }
}

const STUB_SOURCE = `export class DurableObject {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; this.storage = ctx && ctx.storage; }
}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'cloudflare:workers') {
      return { url: 'data:text/javascript;base64,' + Buffer.from(STUB_SOURCE).toString('base64'), shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
