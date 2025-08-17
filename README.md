# Capital Markets Agent Factory (GPT-5 Demo)
_Ready-to-merge repo bootstrap:_ docs, CI, env template, plus **/data** with bundled samples so Mock mode works out of the box.

## What's in this pack
\`\`\`
/data
  style_guide.json
  pattern_library.md
  reg_taxonomy.json
  kpi_definitions.md
  disclaimers.md
  prompts.md
  detect_regime_sample.json
  reg_impact_sample.json
  client_brief_sample.json
  get_watchlist_sample.json
  query_trades_sample.json
/.github/workflows/ci.yml
/scripts/setup-local.sh
.env.example
CONTRIBUTING.md
LICENSE
README.md
\`\`\`

## How to integrate (fixes common issues)
1. **Unzip into the root of your v0.app project** (the folder that contains `package.json`). When prompted, choose **Merge** and **Replace**.
2. Run the setup script to create a local env file:
   \`\`\`bash
   bash ./scripts/setup-local.sh
   \`\`\`
3. Start the app in **Mock** mode (no key needed):
   \`\`\`bash
   npm install
   npm run dev
   # open http://localhost:3000 → header should show Mock
   \`\`\`
4. Switch to **Live** mode (optional GPT-5): edit `.env.local` and set your API key:
   \`\`\`
   OPENAI_API_KEY=sk-...      # server-side only
   GPT_MODEL=gpt-5
   \`\`\`
   Restart `npm run dev`. Header badge should flip to **Live**.

### Deploy on Vercel
- Import repo → Project Settings → **Environment Variables**:
  - `OPENAI_API_KEY` = your key (add to **Production/Preview/Development**)
  - `GPT_MODEL` = `gpt-5`
- Redeploy. (GitHub Actions CI here is for typecheck/build only; Vercel will do its own build for deploy.)

## Features

### Core Agents
- **Research Note Generator**: Analyze 8-K filings and quarterly reports to generate institutional-grade research notes
- **Trading Surveillance**: Monitor trading patterns and generate SAR-compliant surveillance reports  
- **Regime Detection**: Detect market regime changes and provide hedge recommendations by trading desk

### Utilities
- **Regulatory Impact Analysis**: Map regulatory changes to affected trading desks with implementation checklists
- **Client Brief Generator**: Create meeting briefs, talking points, and cross-sell opportunities
- **Knowledge Base**: Upload and manage documents for agent knowledge enhancement

### Key Capabilities
- **Mock/Live Modes**: Run with synthetic data or connect to GPT-4/5 for live analysis
- **Schema Validation**: All outputs validated with Zod schemas for compliance
- **Audit Trail**: Comprehensive logging of all agent activities with downloadable reports
- **Download Functionality**: Export all outputs as Markdown, JSON, or text files
- **Dark/Light Themes**: Full theme support with IBM Plex Sans typography

## Swap sample JSON with real data
1. Drop your real JSON into `/data` using the same file names or upload via the app's UI.
2. On each page, use the **Data** selector (or upload) to re-run in Mock mode.
3. For live endpoints, paste fresh JSON from your systems or extend `/app/api/*` routes to fetch from your backends.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Validation**: Zod schemas for type safety
- **AI Integration**: OpenAI GPT-4/5 (optional)
- **Fonts**: IBM Plex Sans (Google Fonts)

### API Routes
- `POST /api/research/draft` - Generate research notes from PDFs
- `POST /api/surveillance/triage` - Analyze trading patterns and generate SAR memos
- `POST /api/regime/analyze` - Detect market regimes and recommend hedges
- `POST /api/regimpact/analyze` - Analyze regulatory impact across desks
- `POST /api/client/brief` - Generate client meeting materials
- `GET /api/llm/health` - Check LLM integration status
- `GET /api/audit` - Retrieve audit logs
- `POST /api/audit/export` - Export audit logs as JSON

## Troubleshooting
- **Dashboard shows "Live" but outputs are empty** → your server routes are not returning content. Check `/api/llm/health` and the server logs.
- **CI fails with "run build"** → ensure `package.json` has `build` and `typecheck` scripts. The CI workflow tolerates missing scripts, but `build` should exist: `"build": "next build"`.
- **Key leak risk** → never commit `.env.local`. This pack adds `.gitignore` and a CI warning if something like `sk-` appears in the repo.

## Compliance & Security

### Data Handling
- No external data required - runs with synthetic datasets
- All LLM calls happen server-side only
- No API keys exposed to browser
- Comprehensive audit logging for compliance
- Pre-commit hooks prevent API key leaks

### Security Measures
- `.env*` files ignored by git
- Pre-commit hooks scan for API key patterns
- CI/CD warnings for potential secret leaks
- Server-side only LLM integration
- No client-side API key exposure

## License

MIT License - see LICENSE file for details.
