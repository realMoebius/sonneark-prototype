(() => {
  const format = (seconds) => {
    seconds = Math.max(0, Math.floor(seconds));
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [days ? `${days}d` : '', `${hours}h`, `${minutes}m`, `${secs}s`].filter(Boolean).join(' ');
  };
  const update = () => {
    const now = Date.now();
    document.querySelectorAll('[data-countdown-start]').forEach((node) => {
      const start = Date.parse(node.dataset.countdownStart || '');
      const end = Date.parse(node.dataset.countdownEnd || '');
      if (!Number.isFinite(start) || !Number.isFinite(end)) { node.textContent = 'Time unavailable'; return; }
      if (now < start) node.textContent = `Starts in ${format((start - now) / 1000)}`;
      else if (now < end) node.textContent = `Active · ends in ${format((end - now) / 1000)}`;
      else node.textContent = 'Ended';
    });
  };
  update();
  window.setInterval(update, 1000);
})();
