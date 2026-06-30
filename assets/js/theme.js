(() => {
  const key = 'sonneark-theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = new Set(['system', 'light', 'dark']);
  const stored = () => { try { const value = localStorage.getItem(key); return valid.has(value) ? value : null; } catch (_) { return null; } };
  const memberDefault = () => valid.has(root.dataset.themeDefault) ? root.dataset.themeDefault : 'system';
  const getPreference = () => stored() || memberDefault();
  const apply = value => {
    value = valid.has(value) ? value : 'system';
    if (value === 'light' || value === 'dark') root.dataset.theme = value;
    else delete root.dataset.theme;
    document.querySelectorAll('[data-theme-select]').forEach(select => { select.value = value; });
  };
  document.addEventListener('DOMContentLoaded', () => {
    apply(getPreference());
    document.querySelectorAll('[data-theme-select]').forEach(select => select.addEventListener('change', () => {
      const value = valid.has(select.value) ? select.value : 'system';
      try { localStorage.setItem(key, value); } catch (_) {}
      apply(value);
    }));
  });
  media.addEventListener?.('change', () => { if (getPreference() === 'system') apply('system'); });
})();
