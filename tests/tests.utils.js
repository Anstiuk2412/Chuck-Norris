import { test, expect } from './runner.js';
import { formatUpdatedAt } from '../src/utils/date.js';

test('formatUpdatedAt returns minutes', () => {
    const iso = new Date(Date.now() - 5 * 60000).toISOString();
    const txt = formatUpdatedAt(iso);
    expect(txt.includes('min')).toBe(true);
  });

  test('formatUpdatedAt returns hours', () => {
      const iso = new Date(Date.now() - 3 * 3600000).toISOString();
      const txt = formatUpdatedAt(iso);
      expect(txt.includes('hours')).toBe(true);
    });

