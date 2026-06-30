(() => {
  'use strict';

  const languageKey = 'sonneark-language';
  const normaliseLanguage = (value, supported) => {
    const code = String(value || '').trim().toLowerCase().replace('_', '-');
    if (!code) return '';
    if (code === 'zh' || code.startsWith('zh-')) return supported.includes('zh-cn') ? 'zh-cn' : '';
    if (supported.includes(code)) return code;
    const base = code.split('-')[0];
    return supported.includes(base) ? base : '';
  };

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const body = document.body;
    const supported = String(root.dataset.supportedLanguages || 'en').split(',').filter(Boolean);
    const current = String(root.dataset.currentLanguage || 'en');

    let savedLanguage = '';
    try { savedLanguage = localStorage.getItem(languageKey) || ''; } catch (_) {}
    const hasLanguageCookie = document.cookie.split(';').some(item => item.trim().startsWith('sonneark_lang='));
    let autoDone = false;
    try { autoDone = sessionStorage.getItem('sonneark-auto-language-done') === '1'; } catch (_) {}
    if (!savedLanguage && !hasLanguageCookie && root.dataset.memberLanguage !== '1' && !autoDone) {
      const candidates = Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : [navigator.language];
      let preferred = '';
      for (const candidate of candidates) {
        preferred = normaliseLanguage(candidate, supported);
        if (preferred) break;
      }
      try { sessionStorage.setItem('sonneark-auto-language-done', '1'); } catch (_) {}
      if (preferred && preferred !== current) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', preferred);
        window.location.replace(url.toString());
        return;
      }
    }

    document.querySelectorAll('[data-language-select]').forEach(select => {
      select.addEventListener('change', () => {
        const option = select.options[select.selectedIndex];
        const selectedLanguage = option?.dataset.language || '';
        document.querySelectorAll('[data-language-select]').forEach(other => {
          if (other !== select) {
            const matching = [...other.options].find(item => item.dataset.language === selectedLanguage);
            if (matching) other.value = matching.value;
          }
        });
        try { localStorage.setItem(languageKey, selectedLanguage); } catch (_) {}
        if (select.value) window.location.href = select.value;
      });
    });

    const header = document.querySelector('[data-site-header]');
    const headerInner = document.querySelector('[data-header-inner]');
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    const accountMenus = [...document.querySelectorAll('[data-account-menu]')];

    const closeNav = (restoreFocus = false) => {
      if (!nav || !toggle) return;
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-open');
      if (restoreFocus) toggle.focus();
    };

    const closeAccounts = except => {
      accountMenus.forEach(menu => {
        if (menu !== except) menu.removeAttribute('open');
      });
    };

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const open = !nav.classList.contains('open');
        closeAccounts();
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        body.classList.toggle('nav-open', open);
        if (open) nav.querySelector('a,select,button')?.focus({ preventScroll: true });
      });
      nav.addEventListener('click', event => {
        if (event.target.closest('a')) closeNav(false);
      });
    }

    accountMenus.forEach(menu => {
      menu.addEventListener('toggle', () => {
        if (menu.open) {
          closeNav(false);
          closeAccounts(menu);
        }
      });
      menu.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          menu.removeAttribute('open');
          menu.querySelector('summary')?.focus();
        }
      });
    });

    document.addEventListener('click', event => {
      accountMenus.forEach(menu => {
        if (menu.open && !menu.contains(event.target)) menu.removeAttribute('open');
      });
      if (nav?.classList.contains('open') && !nav.contains(event.target) && !toggle?.contains(event.target)) closeNav(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav?.classList.contains('open')) closeNav(true);
    });

    let headerFitFrame = 0;
    const evaluateHeaderFit = () => {
      if (!header || !headerInner) return;
      window.cancelAnimationFrame(headerFitFrame);
      headerFitFrame = window.requestAnimationFrame(() => {
        const compactByViewport = window.innerWidth <= 1480;
        if (compactByViewport) {
          header.classList.remove('header-force-menu');
          return;
        }

        // Measure the natural desktop header once. Do not observe the element itself:
        // switching to compact mode changes its size and would create a resize loop.
        header.classList.remove('header-force-menu');
        const overflowing = headerInner.scrollWidth > headerInner.clientWidth + 2;
        header.classList.toggle('header-force-menu', overflowing);
        if (!overflowing) closeNav(false);
      });
    };
    evaluateHeaderFit();
    window.addEventListener('resize', evaluateHeaderFit, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(evaluateHeaderFit).catch(() => {});

    document.querySelectorAll('form[data-confirm]').forEach(form => {
      form.addEventListener('submit', event => {
        const message = form.dataset.confirm || 'Continue?';
        if (!window.confirm(message)) event.preventDefault();
      });
    });

    document.querySelectorAll('[data-auto-submit]').forEach(element => {
      element.addEventListener('change', () => element.form?.requestSubmit());
    });

    const search = document.getElementById('guide-search');
    const content = document.querySelector('[data-guide-content]');
    const status = document.getElementById('search-status');
    if (search && content) {
      const sections = [...content.querySelectorAll('[data-guide-section]')];
      const noResults = content.dataset.noResults || 'No matching sections found.';
      const run = () => {
        const query = search.value.trim().toLocaleLowerCase();
        let visible = 0;
        sections.forEach(section => {
          const match = query === '' || section.textContent.toLocaleLowerCase().includes(query);
          section.hidden = !match;
          if (match) visible++;
        });
        if (status) status.textContent = query && visible === 0 ? noResults : (query ? `${visible} section(s)` : '');
      };
      search.addEventListener('input', run);
    }

    document.querySelectorAll('[data-local-time]').forEach(element => {
      const iso = element.dataset.localTime;
      const date = iso ? new Date(iso) : null;
      if (date && !Number.isNaN(date.getTime())) {
        element.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
      }
    });

    if ('serviceWorker' in navigator && root.dataset.pwaEnabled === '1') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register(root.dataset.serviceWorker || '/service-worker.js').catch(() => {});
      });
    }
  });
})();
