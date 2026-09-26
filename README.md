# Search Chat

A free AI chat page that automatically searches the web before answering and marks its sources. It's plain HTML, CSS and JavaScript, so it runs on GitHub Pages with no server and no build step.

## Put it online with GitHub Pages

1. Create a new public repository on GitHub.
2. Upload `index.html`, `style.css`, `app.js`, `config.js`, `.nojekyll` and this README to the root of the repo.
3. Go to **Settings → Pages**, set **Source** to "Deploy from a branch", pick `main` and `/ (root)`, and save.
4. After a minute or two your site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

## Site server (optional)

`config.js` holds the address of this site's Cloudflare Worker. The setup assistant fills it in. When it is set, the chat uses the Worker by default: it tries several free AI providers in turn, runs a safety check, and searches the web for news and current events with keys that never reach the browser. Leave `workerUrl` empty to run without it.

## How it works

- **AI providers.** By default it uses Pollinations' anonymous text endpoint, which needs no key. In Settings, visitors can switch to OpenRouter (free key, and the app automatically lists only the models that cost nothing) or any OpenAI-compatible endpoint that allows browser requests.
- **Auto web search.** In Auto mode, factual questions trigger a search of Wikipedia and DuckDuckGo Instant Answers (both free, keyless, and browser-friendly). Results are sent to the model with instructions to cite them as [1], [2]; those citations become highlighted links. Writing and coding requests skip the search. Visitors can set search to Always or Off.

## Safety design

- **No keys in the code.** Never commit an API key: anything in a public repo or a static page can be read by anyone. Visitors' own keys stay in their browser (session-only unless they tick "Remember").
- **Strict Content-Security-Policy.** Only this site's scripts can run, and network calls must use HTTPS.
- **Safe rendering.** Model output is escaped before a small set of Markdown is applied, so a model can't inject HTML or scripts. Links open in a new tab with `noopener`.
- **Prompt-injection guard.** Web results are labeled as untrusted data and the model is told to ignore instructions inside them.
- **Content rules.** A system prompt tells the model to refuse clearly harmful requests. Providers apply their own moderation too, but no filter is perfect, so keep the on-page disclaimer.
- **Abuse limits.** A 4-second cooldown and 2,000-character limit per message protect the free tiers.

## Limits to know

- Free tiers are rate-limited and models change often. If a model disappears, open Settings and choose **Find free models**.
- Wikipedia and DuckDuckGo Instant Answers cover encyclopedic facts well but not breaking news. For full web search (e.g. Brave Search or Tavily) you need a key, which must live on a small proxy such as a Cloudflare Worker, never in this repo. Add another search function in `app.js` next to `searchWikipedia` and include it in `webSearch`.
- Custom endpoints must use `https://`. A local model at `http://localhost` won't work from a GitHub Pages site.

## Customize

- App name and example questions: `index.html`
- Colors and fonts: the variables at the top of `style.css`
- Cooldown, limits, providers and the system prompt: the top of `app.js`
