import { formatUpdatedAt } from "../utils/date.js";

export function renderJokeCard({ joke, isFavourite }) {
  const tpl = document.getElementById('joke-card-template');
  const node = tpl.content.firstElementChild.cloneNode(true);
  const link = node.querySelector('.joke-card__link');
  const time = node.querySelector('.joke-card__updated');
  const cats = node.querySelector('.joke-card__categories');

  node.setAttribute('data-joke-id', joke.id);

  link.href = joke.url;
  link.innerHTML = `<span class="id">${joke.id}</span><svg class="icon link" aria-hidden="true"><use href="assets/icons/sprite.svg#link"></use></svg>`;
  node.querySelector('.joke-card__text').textContent = joke.value;

  time.dateTime = joke.updated_at;
  time.textContent = `Last update ${formatUpdatedAt(joke.updated_at)}`;

  cats.innerHTML = '';

  (joke.categories || []).forEach(c => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = c;
      cats.appendChild(tag);
    });
    const favBtn = node.querySelector('.joke-card__favourite');
    favBtn.setAttribute('aria-pressed', isFavourite ? 'true' : 'false');
    favBtn.innerHTML = `<svg aria-hidden="true" class="icon"><use href="assets/icons/sprite.svg#${isFavourite ? 'heart' : 'emptyHeart'}"></use></svg>`;
    return node;
  }

