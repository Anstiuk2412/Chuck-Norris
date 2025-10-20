import { test, expect } from './runner.js';
import { ChuckApi } from '../src/services/chuckApi.js';

// Only light tests that do not flood the public API
test('ChuckApi builds URL without trailing slash duplication', async () => {
    const api = new ChuckApi('https://api.chucknorris.io/');
    // monkey patch _get to capture the path
    let calledPath = '';
    api._get = async function(path) { calledPath = path; return {}; };

    await api.random();
    expect(calledPath).toBe('/jokes/random');
  });

