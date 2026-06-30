(() => {
  const INDEX = [
    { title: "Welcome to SonneARK", id: "welcome-to-sonneark", tag: "Guide", excerpt: "Introduction to SonneARK Server 1155 — guild structure, communication channels and first steps for new members." },
    { title: "The core progression cycle", id: "the-core-progression-cycle", tag: "Guide", excerpt: "Understanding the weekly progression rhythm: infrastructure days, military expansion and the final sprint toward event goals." },
    { title: "Useful daily habits", id: "useful-daily-habits", tag: "Guide", excerpt: "Daily routines that compound over a season — resource checks, fleet upkeep and contribution minimums for active members." },
    { title: "Fleet energy, counters and champion matching", id: "fleet-energy-counters-and-champion-matching", tag: "Guide", excerpt: "How fleet energy regeneration works, counter relationships between ship types and how to match champions for maximum output." },
    { title: "Commerce Guild Duel and Top 100 Traders", id: "commerce-guild-duel-and-top-100-traders", tag: "Guide", excerpt: "Mechanics and scoring for the Commerce Guild Duel event and the Top 100 Traders ranking — timing, priorities and coordination." },
    { title: "Day 1 — Infrastructure development", id: "day-1-infrastructure-development", tag: "Guide", excerpt: "First day focus: building foundations, unlocking key upgrades and establishing resource flow before the military phase begins." },
    { title: "Day 2 — Talent nurturing", id: "day-2-talent-nurturing", tag: "Guide", excerpt: "Talent allocation priorities on day two and how to distribute development points efficiently across your roster." },
    { title: "Day 3 — Military expansion", id: "day-3-military-expansion", tag: "Guide", excerpt: "Shift to military build-out: fleet recruitment, combat research and preparation for Operation Blackout on days 3 and 4." },
    { title: "Operation Blackout", id: "operation-blackout-important-on-days-3-and-4", tag: "Guide", excerpt: "Critical guild-wide coordinated action on days 3 and 4. All available members required. See Operations page for current status." },
    { title: "Day 4 — Flagship development", id: "day-4-flagship-development", tag: "Guide", excerpt: "Flagship upgrade priorities and which modules to prioritize in the final push before the day-5 sprint window opens." },
    { title: "Day 5 — All-out sprint", id: "day-5-all-out-sprint", tag: "Guide", excerpt: "Maximum activity window — stacking bonuses, event contributions and fleet deployments to close the weekly cycle strong." },
    { title: "Day 6 — Battlefield showdown", id: "commerce-guild-duel-day-6-battlefield-showdown", tag: "Guide", excerpt: "Commerce Guild Duel finale on day 6: how to read the bracket, when to push and when to conserve resources." },
    { title: "Top 100 — Disciple hunting grounds and PvP", id: "top-100-day-6-disciple-hunting-grounds-and-pvp", tag: "Guide", excerpt: "Day 6 PvP mechanics for Top 100 contenders — target selection, disciple hunting windows and safe zones." },
    { title: "Commerce Guild Duel — research priorities", id: "commerce-guild-duel-research-priorities", tag: "Guide", excerpt: "Which research branches pay off most in Commerce Guild Duel scoring and which to defer until after the event." },
    { title: "SonneARK home port benefits", id: "sonneark-home-port-benefits", tag: "Guide", excerpt: "Advantages of Yeregania-III as home port: resource bonuses, travel costs and alliance proximity benefits." },
    { title: "Other important events", id: "other-important-events", tag: "Guide", excerpt: "Overview of recurring events outside the main weekly cycle — participation thresholds, rewards and coordination requirements." },
    { title: "Recommended event checklist", id: "recommended-event-checklist", tag: "Guide", excerpt: "A practical checklist for maximising event participation across the week — when to act, what to skip and what to never miss." },
    { title: "Final note", id: "final-note", tag: "Guide", excerpt: "Closing guidance from guild leadership on how to grow as a SonneARK member and where to ask questions." },
    { title: "Meteoric Shower", id: null, tag: "Event", href: "operations.html", excerpt: "Active bonus event — resource yield across all deposit types increased. Coordinate harvest teams for maximum output." },
    { title: "Fleet Mobilization", id: null, tag: "Event", href: "operations.html", excerpt: "Upcoming guild-wide fleet movement exercise. All R4+ members report to assembly point before the event starts." },
    { title: "Homecoming Bonus", id: null, tag: "Event", href: "operations.html", excerpt: "24-hour XP and loyalty point multiplier. Best window for onboarding new recruits and catching up on talent research." },
    { title: "Alliance Assembly", id: null, tag: "Event", href: "operations.html", excerpt: "Cross-guild coordination meeting. Attendance required for voting members. Discord link posted 30 minutes prior." },
  ];

  const form = document.querySelector('.universal-search');
  const input = document.getElementById('q');
  const main = document.querySelector('main .section');

  if (!form || !input || !main) return;

  let resultsEl = document.getElementById('search-results-area');
  if (!resultsEl) {
    resultsEl = document.createElement('div');
    resultsEl.id = 'search-results-area';
    resultsEl.style.marginTop = '32px';
    main.appendChild(resultsEl);
  }

  const highlight = (text, query) => {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
  };

  const render = (query) => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) { resultsEl.innerHTML = ''; return; }

    const matches = INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      resultsEl.innerHTML = `<p class="empty-state">No results for <strong>${query}</strong>. Try a different term.</p>`;
      return;
    }

    const href = (item) => item.href || `guide.html${item.id ? '#' + item.id : ''}`;

    resultsEl.innerHTML = `
      <p class="muted" style="margin:0 0 16px">${matches.length} result${matches.length !== 1 ? 's' : ''} for <strong>${query}</strong></p>
      <div class="search-results">
        ${matches.map(item => `
          <article class="panel search-result">
            <div class="card-topline" style="margin-bottom:8px">
              <span class="pill">${item.tag}</span>
            </div>
            <h3 style="margin:0 0 6px;font-size:1.1rem"><a href="${href(item)}">${highlight(item.title, query)}</a></h3>
            <p style="margin:0;color:var(--muted)">${highlight(item.excerpt, query)}</p>
          </article>
        `).join('')}
      </div>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    render(input.value);
  });

  input.addEventListener('input', () => render(input.value));

  const params = new URLSearchParams(location.search);
  const initial = params.get('q');
  if (initial) { input.value = initial; render(initial); }
})();
