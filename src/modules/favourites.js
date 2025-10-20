import { renderJokeCard } from '../ui/jokeCard.js';

export function renderFavourites(els, store, toggleFavourite){
  const favs = store.getAll();
  els.favourites.innerHTML = '';
  if(favs.length === 0){
    const h = document.createElement('div');
    h.textContent = 'No favourites yet.';
    h.style.color = '#8d8d95';
    els.favourites.appendChild(h);
    return;
  }
  favs.forEach(j => {
    const card = renderJokeCard({ joke: j, isFavourite: true });
    card.querySelector('.joke-card__favourite').addEventListener('click', () => toggleFavourite(j));
    els.favourites.appendChild(card);
  });
}

export function syncFavouriteButtons(store){
  document.querySelectorAll('.joke-card').forEach(card => {
    const id = card.getAttribute('data-joke-id');
    const isFav = store.isFavourite(id);
    const btn = card.querySelector('.joke-card__favourite');
    btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    btn.innerHTML = `<svg aria-hidden=\"true\" class=\"icon\"><use href=\"assets/icons/sprite.svg#${isFav ? 'heart' : 'emptyHeart'}\"></use></svg>`;
  });
}


