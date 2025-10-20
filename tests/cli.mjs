import { summarize } from './runner.js';

// Import tests
import './tests.utils.js';
import './tests.store.js';
import './tests.api.js';

// Wait for async tests, then summarize and set exit code
await summarize();
const { failed } = globalThis.__testState || { failed: 0 };
process.exit(failed > 0 ? 1 : 0);


