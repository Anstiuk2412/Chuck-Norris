const STORAGE_KEY = 'cn-favourites-v1';

export class FavouritesStore {
  constructor(storage = window.localStorage) {
    this.storage = storage;
    this.cache = this._load();
  }

  _load() {
    try{
      const raw = this.storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch (e) {
    return [];
  }
}

_save() {
  try{ this.storage.setItem(STORAGE_KEY, JSON.stringify(this.cache)); }catch (e) { /* ignore */ }
}

getAll() {
  return [...this.cache];
}

isFavourite(id) {
  return this.cache.some(j => j.id === id);
}

add(joke) {
  if (!this.isFavourite(joke.id)) {
    this.cache.unshift(slimJoke(joke));
    this._save();
  }
}

remove(id) {
  const next = this.cache.filter(j => j.id !== id);

  if (next.length !== this.cache.length) {
    this.cache = next;
    this._save();
  }
}
}

function slimJoke(j) {
  return {
    id: j.id,
    url: j.url,
    value: j.value,
    categories: j.categories || [],
    updated_at: j.updated_at || new Date().toISOString(),
  };
}

