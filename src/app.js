import { ChuckApi } from "./services/chuckApi.js";
import { FavouritesStore } from "./services/favouritesStore.js";
import { initModeSwitching } from "./modules/mode.js";
import { renderCategories, getSelectedCategory } from "./modules/categories.js";
import { renderResults, clearResults } from "./modules/results.js";
import { renderFavourites, syncFavouriteButtons } from "./modules/favourites.js";
import { initDrawer } from "./modules/drawer.js";

const api = new ChuckApi();
const store = new FavouritesStore();

const els = {
  mode: () => document.querySelectorAll('input[name="mode"]'),
  categories: document.getElementById("categories"),
  search: document.getElementById("search"),
  searchInput: document.getElementById("search-input"),
  getJoke: document.getElementById("get-joke"),
  results: document.getElementById("results"),
  favourites: document.getElementById("favourites"),
  favToggle: document.getElementById("toggle-favourites"),
  favPanel: document.getElementById("favourites-panel"),
  closeFav: document.getElementById("close-favourites"),
  backdrop: document.getElementById("backdrop"),
};

function toggleFavourite(joke) {
  if (store.isFavourite(joke.id)) {
    store.remove(joke.id);
  } else {
    store.add(joke);
  }

  syncFavouriteButtons(store);
  renderFavourites(els, store, toggleFavourite);
}

async function onSubmit(e) {
  e.preventDefault();
  const mode = [...els.mode()].find(i => i.checked)?.value;

  try {
    // Disable the button while fetching
    const btn = els.getJoke;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');

    if (mode === 'random') {
      const joke = await api.random();
      renderResults(els, store, [joke], toggleFavourite);
    } else if (mode === 'category') {
      const cat = getSelectedCategory(els);

      if (!cat) { clearResults(els); return; }

      const joke = await api.randomFromCategory(cat);
      renderResults(els, store, [joke], toggleFavourite);
    } else if (mode === 'search') {
      const q = (els.searchInput.value || '').trim();
      // Ignore empty/whitespace queries early
      if (!q) { clearResults(els); return; }
      const res = await api.search(q);
      renderResults(els, store, res.result.slice(0, 10), toggleFavourite);
    }

  } catch (err) {
    console.error(err);
    const msg = document.createElement('div');
    msg.textContent = 'Something went wrong. Please try again.';
    msg.style.color = '#eb5757';
    clearResults();
    els.results.appendChild(msg);
  } finally {
    const btn = els.getJoke;
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
  }
}

function initFavPanelToggle() { initDrawer(els); }

async function boot() {
  initModeSwitching(els);
  initFavPanelToggle();
  els.searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') els.getJoke.click(); });
  document.getElementById('controls').addEventListener('submit', onSubmit);
  renderFavourites(els, store, toggleFavourite);

  try {
    const CACHE_KEY = 'cn-categories-v1';
    const MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours
    let categories = null;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.data) && typeof parsed.ts === 'number') {
          if (Date.now() - parsed.ts < MAX_AGE_MS) categories = parsed.data;
        }
      } catch {}
    }
    if (!Array.isArray(categories) || categories.length === 0) {
      categories = await api.categories();
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: categories })); } catch (_) {}
    }
    renderCategories(els, categories);
  } catch (e) {
    console.error('Failed to load categories', e);
  }
}

boot();

