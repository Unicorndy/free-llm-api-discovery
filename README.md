# Free LLM API Discovery

Find AI model APIs you can use for free, and learn how to set each one up.

- **Discover:** https://unicorndy.github.io/free-llm-api-discovery/
- **Test chat:** https://unicorndy.github.io/free-llm-api-discovery/chat.html
- **API guide:** https://unicorndy.github.io/free-llm-api-discovery/api.html
- **Run your own copy:** https://github.com/Unicorndy/free-llm-api-discovery-kit (setup guide and security walkthrough)

## What it does

- **Live web discovery.** Press **Run discovery**:
  - The site server searches the web through a private SearXNG instance.
  - An AI reads the results and lists free LLM API providers, and every link is checked against the search results.
  - Endpoints that need no key are tested automatically.
  - The results are shared by all visitors and refreshed at most once an hour.
- **A curated directory** (`directory.json`) of well-known free providers, with official links, API base URL, example model, free-tier summary, and whether they train on your data.
- **Daily model tests.** A GitHub Action (`.github/workflows/discover.yml`) sends every free model of the approved providers a tiny test prompt and writes `providers.json`.
- **Setup guides** for every provider: sign up, get a key, copy curl/Python/JavaScript code, and **test your key right in the browser**. The key goes straight to the provider and is never sent to this site.
- **Test chat and API:** try the working models in the chat, or call them from your own code through an OpenAI-compatible API.

## How it works

```
Browser ──► this static site (GitHub Pages): discovery page, test chat, API guide
   │
   └──► site server (Cloudflare Worker)
          ├─ live discovery: web search → AI extraction → validation → keyless tests → shared cache
          ├─ chat: safety check, then free providers in order (keys are Worker secrets, never in this repo)
          └─ web search: private SearXNG, Tavily as a rationed fallback
Daily GitHub Action ──► scripts/discover.mjs tests free models ──► providers.json
```

## Safety design

- **No keys in this repo or on the page.** Provider keys are encrypted Cloudflare Worker secrets. The daily Action uses one GitHub Actions secret, which GitHub masks in logs.
- **Web results are untrusted:**
  - Discovery only keeps `https` links on domains that appeared in the search results.
  - Auto-tests only call public hosts, without following redirects.
  - Everything is shown with plain text rendering and labelled **unverified**.
- **Your key stays yours.** The key test runs from your browser straight to the provider. Nothing is stored.
- **Opt-in for unknown services.** Web-found providers that work without a key can be chosen in the test chat, but the server never uses them automatically.
- **Locked-down server:**
  - Other websites' browsers can't call it.
  - API access needs a key.
  - Requests are rate-limited and size-capped.
  - Every chat question passes a Llama Guard safety check first.
- **Strict Content-Security-Policy and escaped rendering.** Only this site's own scripts run, and model output can't inject HTML.
- **Privacy:** messages sent in the test chat go to third-party AI providers, so don't share private information.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `home.js`, `home.css`, `directory.json` | Discovery page and curated directory |
| `chat.html`, `app.js`, `style.css` | Test chat |
| `api.html`, `api.js`, `api.css` | API guide and live model list |
| `config.js` | The site server's address |
| `providers.json` | Daily model test results, committed by the bot |
| `scripts/discover.mjs`, `.github/workflows/discover.yml` | Daily model tests |

## License

[MIT](LICENSE)
