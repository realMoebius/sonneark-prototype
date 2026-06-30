(() => {
  const input = document.getElementById('guide-search');
  const status = document.getElementById('search-status');
  const content = document.querySelector('[data-guide-content]');
  const noResultsMsg = content?.dataset.noResults || 'No matching sections found.';

  if (!input || !content) return;

  const sections = Array.from(document.querySelectorAll('[data-guide-section]'));
  const tocLinks = Array.from(document.querySelectorAll('.toc a'));

  let noResults = document.createElement('p');
  noResults.className = 'empty-state';
  noResults.textContent = noResultsMsg;
  noResults.hidden = true;
  content.appendChild(noResults);

  const filter = (query) => {
    const q = query.trim().toLowerCase();

    if (q.length < 2) {
      sections.forEach(s => s.hidden = false);
      tocLinks.forEach(a => a.hidden = false);
      noResults.hidden = true;
      status.textContent = '';
      return;
    }

    let visible = 0;
    sections.forEach(section => {
      const matches = section.textContent.toLowerCase().includes(q);
      section.hidden = !matches;
      if (matches) visible++;

      const id = section.id;
      const link = tocLinks.find(a => a.getAttribute('href') === '#' + id);
      if (link) link.hidden = !matches;
    });

    noResults.hidden = visible > 0;
    status.textContent = visible > 0
      ? `${visible} section${visible !== 1 ? 's' : ''} match "${query}"`
      : '';
  };

  input.addEventListener('input', () => filter(input.value));

  // Highlight active TOC link on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(a => a.classList.remove('active'));
        const active = tocLinks.find(a => a.getAttribute('href') === '#' + entry.target.id);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
})();
