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

export default { stripInlineRefs, safePrefix };
