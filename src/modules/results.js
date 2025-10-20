import { renderJokeCard } from '../ui/jokeCard.js';

export function clearResults(els){
  els.results.innerHTML = '';
}

export function renderResults(els, store, jokes, toggleFavourite){
  clearResults(els);
  if(!jokes || jokes.length === 0){
    const empty = document.createElement('div');
    empty.textContent = 'No jokes found.';
    empty.style.color = '#8d8d95';
    els.results.appendChild(empty);
    return;
  }
  jokes.forEach(j => {
    const card = renderJokeCard({ joke: j, isFavourite: store.isFavourite(j.id) });
    card.querySelector('.joke-card__favourite').addEventListener('click', () => toggleFavourite(j));
    els.results.appendChild(card);
  });
}


