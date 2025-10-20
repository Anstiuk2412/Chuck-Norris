import { test, expect } from './runner.js';
import { FavouritesStore } from '../src/services/favouritesStore.js';

// Use in-memory storage mock
const memoryStorage = () => {
  const data = new Map();
  return {
    getItem:k=>data.has(k)?data.get(k):null,
    setItem:(k, v)=>data.set(k, v),
    removeItem:(k)=>data.delete(k)
  };

};

test('store add/remove/isFavourite', () => {
    const store = new FavouritesStore(memoryStorage());
    const joke = { id: '1', value: 'test', url:'#', categories:[], updated_at: new Date().toISOString() };

    expect(store.isFavourite('1')).toBe(false);
    store.add(joke);
    expect(store.isFavourite('1')).toBe(true);
    store.remove('1');
    expect(store.isFavourite('1')).toBe(false);
  });

  test('store persists data shape', () => {
      const s = memoryStorage();
      const store = new FavouritesStore(s);
      store.add({ id: '2', value:'x', url:'#', categories:['dev'], updated_at: new Date().toISOString() });
      const raw = JSON.parse(s.getItem('cn-favourites-v1'));
      expect(Array.isArray(raw)).toBe(true);
      expect(raw[0].id).toBe('2');
    });

