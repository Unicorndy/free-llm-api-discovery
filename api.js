// API guide page: fills in this site's server URL, adds copy buttons, shows live status.
(() => {
  const CONFIG = window.SEARCH_CHAT_CONFIG || {};
  const server = /^https:\/\//.test(CONFIG.workerUrl || '') ? CONFIG.workerUrl.replace(/\/+$/, '') : '';

  if (server) {
    document.querySelectorAll('.base').forEach((n) => { n.textContent = server; });
    document.querySelectorAll('.base-v1').forEach((n) => { n.textContent = server + '/v1'; });
  }

  document.querySelectorAll('pre').forEach((pre) => {
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.replaceWith(wrap);
    wrap.append(pre);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Select and copy';
      }
      setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
    });
    wrap.append(btn);
  });

  const status = document.getElementById('liveStatus');
  if (!server) { status.textContent = 'This site has no server set up.'; status.className = 'bad'; return; }
  fetch(server + '/health', { credentials: 'omit' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((h) => {
      const providers = (h.providers || []).join(', ') || 'none';
      status.textContent = `Online · providers: ${providers} · web search: ${h.search ? 'on' : 'off'}`;
      status.className = 'ok';
    })
    .catch(() => { status.textContent = "Couldn't reach the server right now."; status.className = 'bad'; });
})();
