#!/usr/bin/env python3
"""Real-DO rate-limit flood: 31 sequential POSTs in one minute.
Expected per code: PER_IP_PER_MINUTE=20 -> reqs 1-20 = 200, reqs 21-31 = 429.
Starts at the next whole-minute boundary so the whole burst lands in one bucket.
"""
import json, time, urllib.request, urllib.error

BASE = 'http://127.0.0.1:8787'
DEVS = '/home/nextagi/public_html/chat-worker/.dev.vars'
OUT = '/home/nextagi/public_html/chat-worker/flood-results.json'
N = 31
token = None
for line in open(DEVS):
    if line.startswith('TURNSTILE_SECRET='):
        token = line.strip().split('=', 1)[1]

def call():
    body = json.dumps({'messages': [{'role': 'user', 'content': 'flood probe'}],
                       'cf_turnstile_response': token}).encode()
    req = urllib.request.Request(BASE + '/api/chat', data=body, method='POST',
        headers={'Content-Type': 'application/json', 'Origin': 'http://localhost:8787'})
    t0 = time.time()
    try:
        r = urllib.request.urlopen(req, timeout=60)
        r.read()
        st, err = r.status, None
    except urllib.error.HTTPError as e:
        st = e.code
        try: err = json.loads(e.read().decode()).get('error')
        except Exception: err = '?'
    return st, err, time.time() - t0

# align to minute boundary (leave 40s of the bucket for the burst)
now = time.time()
phase = now % 60
wait = (40 - phase) % 60 or 60
print(f'waiting {wait:.1f}s for minute alignment...')
time.sleep(wait)

rows = []
for i in range(1, N + 1):
    st, err, dt = call()
    rows.append({'req': i, 'status': st, 'err': err, 'latency_s': round(dt, 2)})
    mark = '' if st == 200 else '  <-- 429'
    print(f'req {i:2d}: {st} {err or ""} {dt:.2f}s{mark}')

ok = sum(1 for r in rows if r['status'] == 200)
lim = sum(1 for r in rows if r['status'] == 429)
first429 = next((r['req'] for r in rows if r['status'] == 429), None)
print('=' * 50)
print(f'SUMMARY: {ok} x 200, {lim} x 429, first 429 at request #{first429}')
print(f'EXPECTED (PER_IP_PER_MINUTE=20): first 429 at #21')
json.dump(rows, open(OUT, 'w'), indent=2)
print('saved ->', OUT)
