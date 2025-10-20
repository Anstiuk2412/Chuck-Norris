export function initDrawer(els){
  const isDrawerViewport = () => window.innerWidth < 1200;
  const open = () => {
    els.favToggle.setAttribute('aria-expanded', 'true');
    if(isDrawerViewport()){
      els.favPanel.classList.add('open');
      els.backdrop.classList.remove('hidden');
    }
  };
  const close = () => {
    els.favToggle.setAttribute('aria-expanded', 'false');
    if(isDrawerViewport()){
      els.favPanel.classList.remove('open');
      els.backdrop.classList.add('hidden');
    }
  };
  els.favToggle.addEventListener('click', () => {
    const expanded = els.favToggle.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });
  els.closeFav.addEventListener('click', close);
  els.backdrop.addEventListener('click', close);
  window.addEventListener('resize', () => {
    if(!isDrawerViewport()){
      els.favPanel.classList.remove('open');
      els.backdrop.classList.add('hidden');
    }
  });
}


