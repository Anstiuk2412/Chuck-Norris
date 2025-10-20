export function initModeSwitching(els){
  const updateVisibility = () => {
    const selected = [...els.mode()].find(i => i.checked)?.value;
    els.categories.classList.add('hidden');
    els.search.classList.add('hidden');
    if(selected === 'category'){
      els.categories.classList.remove('hidden');
    } else if(selected === 'search'){
      els.search.classList.remove('hidden');
    }
  };

  els.mode().forEach(r => r.addEventListener('change', updateVisibility));
  const controlsForm = document.getElementById('controls');
  if (controlsForm) {
    controlsForm.addEventListener('input', updateVisibility);
    controlsForm.addEventListener('change', updateVisibility);
  }
  updateVisibility();
}


