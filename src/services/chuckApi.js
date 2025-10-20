export class ChuckApi {
  constructor(baseUrl = 'https://api.chucknorris.io') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async _get(path) {
    const res = await fetch(`${this.baseUrl}${path}`, { headers: { 'Accept': 'application/json' } });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  random() {
    return this._get('/jokes/random');
  }

  randomFromCategory(category) {
    return this._get(`/jokes/random?category=${encodeURIComponent(category)}`);
  }

  categories() {
    return this._get('/jokes/categories');
  }

  search(query) {
    return this._get(`/jokes/search?query=${encodeURIComponent(query)}`);
  }
}

