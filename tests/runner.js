const isBrowser = typeof document !== 'undefined';
const resultsEl = isBrowser ? document.getElementById('results') : null;

const state = { total: 0, passed: 0, failed: 0 };

// expose minimal state for CLI exit codes
globalThis.__testState = state;
const pending = [];

function logCase(name, ok, message) {
  const text = `${ok ? '✔' : '✖'} ${name}${message ? ' — ' + message : ''}`;

  if (isBrowser && resultsEl) {
    const div = document.createElement('div');
    div.className = `case ${ok ? 'ok' : 'fail'}`;
    div.textContent = text;
    resultsEl.appendChild(div);
  } else {
  // eslint-disable-next-line no-console
  console.log(text);
}
}

export function test(name, fn) {
  state.total += 1;

  try{
    const res = fn();

    if (res instanceof Promise) {
      const p = res.then(() => { state.passed += 1; logCase(name, true); })
      .catch (err => { state.failed += 1; logCase(name, false, err.message || String(err)); });
      pending.push(p);
      return p;
    } else {
    state.passed += 1; logCase(name, true);
  }

}catch (err) {
state.failed += 1; logCase(name, false, err.message || String(err));
}
}

export function expect(actual) {
  return {
    toBe(expected) { if (actual !== expected) throw new Error(`Expected ${actual} to be ${expected}`); },
    toEqual(expected) { const a = JSON.stringify(actual); const b = JSON.stringify(expected); if (a !== b) throw new Error(`Expected ${a} to equal ${b}`); },
    toBeTruthy() { if (!actual) throw new Error(`Expected value to be truthy`); },
    toBeFalsy() { if (!!actual) throw new Error(`Expected value to be falsy`); },
  };
}

export async function summarize() {
  if (pending.length) {
    try { await Promise.allSettled(pending); } catch (_) { /* ignore */ }
  }

  const text = `Passed ${state.passed}/${state.total}. Failed ${state.failed}.`;

  if (resultsEl) {
    const div = document.createElement('div');
    div.className = 'summary';
    div.textContent = text;
    resultsEl.appendChild(div);
  }

  if (!isBrowser) {
    // eslint-disable-next-line no-console
    console.log(text);
  }
}

// Tests are imported separately (browser: tests/index.html, CLI: tests/cli.mjs)

