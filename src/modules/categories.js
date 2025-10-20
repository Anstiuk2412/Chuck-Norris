export function renderCategories(els, categories){
  els.categories.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.type = 'button';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      const current = els.categories.querySelector('.chip[aria-pressed="true"]');
      if(current){ current.setAttribute('aria-pressed', 'false'); }
      btn.setAttribute('aria-pressed', 'true');
      btn.dataset.selected = 'true';
    });
    els.categories.appendChild(btn);
  });
}

export function getSelectedCategory(els){
  const selected = els.categories.querySelector('.chip[aria-pressed="true"]');
  return selected ? selected.textContent : null;
}


