# Search Chat

A free AI chat that searches the web before answering and cites its sources, plus an OpenAI-compatible API for your own projects.

- **Chat:** https://unicorndy.github.io/free-llm-api-discovery/
- **API guide and live list of free models:** https://unicorndy.github.io/free-llm-api-discovery/api.html

## How it works

```
Browser ──► this static site (GitHub Pages)
   │
   └──► site server (Cloudflare Worker): safety check, then free AI providers in order
            ├─ Workers AI · Groq · OpenRouter · NVIDIA   (keys are Worker secrets, never in this repo)
            └─ web search: a private SearXNG instance, with Tavily as a rationed fallback
Daily GitHub Action ──► scripts/discover.mjs tests free models ──► providers.json
```

- **Auto web search:** factual questions trigger a search. The Worker's search runs alongside Wikipedia and DuckDuckGo. Results go to the model labelled as untrusted data, and the citations [1], [2] become highlighted links.
- **Free-model discovery:** every day at 03:17 UTC, `.github/workflows/discover.yml` runs `scripts/discover.mjs`:
  - It lists the free models of each approved provider and sends each one a tiny test prompt through the site server.
  - It writes `providers.json`, which the site server, the Settings dialog and the API page read, so dead models drop out and new ones appear.
  - It only scans approved providers and never adds a new one by itself.
- **Transparency:** every answer says which provider and model wrote it.
- **Choices:** in Settings, visitors can pick a specific checked model, use keyless Pollinations, or use their own OpenRouter or OpenAI-compatible key. Their key stays in their browser.

## Use the API

It speaks the OpenAI format, so set your library's base URL to `https://search-chat.unicorndy.workers.dev/v1` and use model `auto`. It needs an API key issued by the site owner. See [api.html](https://unicorndy.github.io/free-llm-api-discovery/api.html) for curl, Python and JavaScript examples, limits and error codes.

## Safety design

- **No keys in this repo or on the page.** Provider keys are encrypted Cloudflare Worker secrets. The discovery Action uses one GitHub Actions secret, which GitHub masks in logs.
- **Locked-down server:**
  - Browsers on other websites can't call it.
  - API access needs a key, and only keys can use extras such as trying unchecked models.
  - Requests are rate-limited and size-capped.
- **Safety check:** Llama Guard screens every question before any AI provider sees it. The system prompt refuses clearly harmful requests.
- **Safe rendering and strict CSP:** model and search output is escaped before a small set of Markdown is applied. Only this site's own scripts can run.
- **Prompt-injection guard:** web results are marked as untrusted data, and the model is told to ignore instructions inside them.
- **Privacy note:** messages go to third-party AI providers, so don't share private information. `providers.json` records each provider's known data-training policy.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `app.js`, `style.css` | The chat |
| `api.html`, `api.js`, `api.css` | API guide and live model list |
| `config.js` | The site server's address |
| `providers.json` | Daily discovery results, committed by the bot |
| `scripts/discover.mjs`, `.github/workflows/discover.yml` | Discovery job |

The source of truth lives in a private kit repository. This repo is its published `site/` folder.
