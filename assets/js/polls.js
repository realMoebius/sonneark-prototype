(() => {
  const POLLS = [
    {
      id: 'fleet-mobilization-time',
      question: 'Fleet Mobilization — which time slot works best for you?',
      status: 'Open',
      closes: '2026-07-01T16:00:00Z',
      options: [
        { id: 'a', label: 'Saturday 18:00 UTC' },
        { id: 'b', label: 'Saturday 20:00 UTC' },
        { id: 'c', label: 'Sunday 18:00 UTC' },
        { id: 'd', label: 'Sunday 20:00 UTC' },
      ],
    },
    {
      id: 'alliance-assembly-slot',
      question: 'Alliance Assembly — preferred meeting time?',
      status: 'Open',
      closes: '2026-07-03T12:00:00Z',
      options: [
        { id: 'a', label: 'Friday 19:00 UTC' },
        { id: 'b', label: 'Friday 21:00 UTC' },
        { id: 'c', label: 'Saturday 19:00 UTC' },
      ],
    },
    {
      id: 'homecoming-kickoff',
      question: 'Homecoming Bonus — best kick-off time for the guild?',
      status: 'Closed',
      closes: '2026-06-28T12:00:00Z',
      options: [
        { id: 'a', label: 'Monday 08:00 UTC' },
        { id: 'b', label: 'Monday 12:00 UTC' },
        { id: 'c', label: 'Monday 18:00 UTC' },
      ],
      seed: [14, 31, 9],
    },
  ];

  const storageKey = (pollId) => `sonneark-poll-${pollId}`;

  const getVotes = (poll) => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey(poll.id)) || 'null');
      if (stored) return stored;
    } catch {}
    return poll.seed
      ? Object.fromEntries(poll.options.map((o, i) => [o.id, poll.seed[i] || 0]))
      : Object.fromEntries(poll.options.map(o => [o.id, 0]));
  };

  const getMyVote = (pollId) => localStorage.getItem(`${storageKey(pollId)}-my`) || null;

  const saveVote = (poll, optionId) => {
    const votes = getVotes(poll);
    const prev = getMyVote(poll.id);
    if (prev) votes[prev] = Math.max(0, (votes[prev] || 0) - 1);
    votes[optionId] = (votes[optionId] || 0) + 1;
    localStorage.setItem(storageKey(poll.id), JSON.stringify(votes));
    localStorage.setItem(`${storageKey(poll.id)}-my`, optionId);
  };

  const renderPoll = (poll) => {
    const votes = getVotes(poll);
    const myVote = getMyVote(poll.id);
    const total = Object.values(votes).reduce((s, v) => s + v, 0);
    const isClosed = poll.status === 'Closed';
    const showResults = myVote !== null || isClosed;

    const pct = (optId) => total > 0 ? Math.round((votes[optId] || 0) / total * 100) : 0;
    const isWinner = (optId) => {
      const max = Math.max(...Object.values(votes));
      return (votes[optId] || 0) === max && max > 0;
    };

    const closeDate = new Date(poll.closes).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return `
      <article class="panel poll-card" id="poll-${poll.id}">
        <header>
          <div>
            <span class="pill">${poll.status}</span>
            <h2 style="margin:.5rem 0 0;font-size:1.15rem">${poll.question}</h2>
          </div>
          <span class="muted" style="white-space:nowrap;font-size:.85rem">${isClosed ? 'Closed' : 'Closes'} ${closeDate}</span>
        </header>

        ${showResults ? `
          <div style="margin-top:16px;display:grid;gap:10px">
            ${poll.options.map(opt => `
              <div style="display:grid;gap:4px">
                <div style="display:flex;justify-content:space-between;gap:12px;font-size:.9rem">
                  <span style="font-weight:${isWinner(opt.id) ? '800' : '400'}">${opt.label}${opt.id === myVote ? ' <span class="muted">(your vote)</span>' : ''}</span>
                  <span style="font-weight:800">${pct(opt.id)}% <span class="muted">${votes[opt.id] || 0}</span></span>
                </div>
                <progress class="poll-result" max="100" value="${pct(opt.id)}" style="${isWinner(opt.id) ? 'accent-color:var(--primary)' : ''}"></progress>
              </div>
            `).join('')}
            <p class="muted" style="margin:4px 0 0;font-size:.82rem">${total} vote${total !== 1 ? 's' : ''}${!isClosed ? ' · <button class="button small secondary" data-change-vote="' + poll.id + '">Change vote</button>' : ''}</p>
          </div>
        ` : `
          <form class="poll-options" data-poll-form="${poll.id}" style="margin-top:16px">
            ${poll.options.map(opt => `
              <label>
                <input type="radio" name="poll-${poll.id}" value="${opt.id}">
                ${opt.label}
              </label>
            `).join('')}
            <button type="submit" class="button primary" style="margin-top:4px">Submit vote</button>
          </form>
        `}
      </article>`;
  };

  const mount = () => {
    const container = document.getElementById('polls-container');
    if (!container) return;
    container.innerHTML = `<div class="poll-list">${POLLS.map(renderPoll).join('')}</div>`;
    container.querySelectorAll('[data-poll-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pollId = form.dataset.pollForm;
        const poll = POLLS.find(p => p.id === pollId);
        const selected = form.querySelector('input[type=radio]:checked');
        if (!selected || !poll) return;
        saveVote(poll, selected.value);
        document.getElementById(`poll-${pollId}`).outerHTML = renderPoll(poll);
        bindEvents();
      });
    });
    container.querySelectorAll('[data-change-vote]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pollId = btn.dataset.changeVote;
        localStorage.removeItem(`${storageKey(pollId)}-my`);
        const poll = POLLS.find(p => p.id === pollId);
        document.getElementById(`poll-${pollId}`).outerHTML = renderPoll(poll);
        bindEvents();
      });
    });
  };

  const bindEvents = () => mount();
  mount();
})();
