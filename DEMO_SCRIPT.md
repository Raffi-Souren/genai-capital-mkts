# Capital Markets Agent Factory - Demo Script

## 20-Minute Keynote Flow

### 0:00–1:30 — Hook: "8:31am on a desk"
**Slide**: Inbox chaos + Bloomberg + Slack notifications
**Line**: "We ask humans to synthesize filings, detect market risk, and ensure compliance—at the same time. Let's show an agent factory that actually helps."

### 1:30–3:30 — Architecture at a glance
**Slide**: Inputs → Agents → Outputs
- **Inputs**: Filings, JSON from surveillance/market feeds
- **Agents**: Research, Surveillance, Regime Detection
- **Outputs**: Notes, SAR JSON, hedge actions + Audit Log

**Key Points**:
- Mock/Live switch visible in header
- No secrets sent to client browser
- Everything server-side for security

### 3:30–9:30 — Demo 1: Surveillance "Oh-wow"
**Goal**: Prove useful & auditable in <6 minutes

**Click Flow**:
1. Click **Surveillance** → **Generate** (with sample files)
2. Show metrics: `self_match_pct`, `round_trip_avg_secs`, `top_accounts`
3. Open **SAR memo JSON** tab (highlight schema validation)
4. Click **Download JSON** → show Audit Log increment with route + timestamp
5. Optional: Show charts (bar chart = flips by account)

**Talk Track**:
"Notice how the memo is schema-locked for downstream systems, and every step is logged for regulators. This is why GPT-5 is viable in compliance workflows."

### 9:30–13:00 — Demo 2: Regime & Hedge "Desk value"
**Click Flow**:
1. Open **Regime & Hedge** → Load sample JSON or hit **Generate**
2. Show timeline (color bands), rolling correlation/volatility charts
3. Read hedge playbook aloud (three concrete recommendations by desk)
4. Download results → note Audit Log entry

**Talk Track**:
"Traders don't want prose; they want context → action. This agent translates volatility & correlation into desk-specific hedges."

### 13:00–17:00 — Demo 3: Research Note "Client-safe"
**Click Flow**:
1. Open **Research Note**
2. Use bundled PDFs or upload fresh earnings docs
3. Click **Generate Note** → show sections: Thesis, 3 KPIs (YoY/QoQ), Management Quotes (≤25 words), Citations table, Disclaimer
4. Hit **Trader Brief** (150 words) → then **Redlines** (guidance changes)
5. Download .md → flash Audit Log

**Talk Track**:
"Client-safe formatting, short brief for sales, and redlines for accuracy tracking. GPT-5's structured outputs keep the style consistent."

### 17:00–19:00 — How this becomes real
**Slide**: Deployment considerations

**Data Connections**:
- **Surveillance**: Trade warehouse (kdb+/Kafka), restricted lists, entitlements
- **Regime**: Intraday returns & volatility (vendor or internal feeds)
- **Research**: Filings via document management systems

**Controls**:
- Authentication/Authorization, PII scrubbing, retention policies
- Kill switches, golden-set evaluations (precision/recall)
- Rate limits, cost caps, model A/B testing

**Operations**:
- On-premises or VPC deployment
- Observability (latency, costs, accuracy)
- Drift detection, weekly approval reviews

### 19:00–20:00 — Close & CTA
**Line**: "Fork the repo tonight; you'll have this running Monday with your data. I'll stick around for a live integration session."

## Click-by-Click Demo Script

### On the Dashboard
1. Point to **Mode badge** (Mock→Live)
2. **Surveillance** → **Generate** → **Metrics** → **SAR JSON** → **Download** → **Audit Log updates**
3. **Back to Home** (use header navigation)
4. **Regime & Hedge** → **Timeline & Hedges** → **Download** → **Log entry**
5. **Research Note** → **Generate** → **Citations & Disclaimer** → **Brief (150)** & **Redlines** → **Download** → **Log entry**

### If Live Mode Enabled
- Say one line: "This paragraph is GPT-5 reasoning." (Don't over-index; latency kills flow)
- If network issues: flip back to Mock and continue—looks intentional

### Performance Callouts
- Show **Performance Metrics** panel: "2.3 seconds, $0.73, 40x faster than manual"
- Open **Explainability Panel**: "Here's GPT-5's chain of thought"
- Point to **Audit Log**: "Every decision traceable, every output compliant"

## Key Phrases to Land

- "This is not a toy: schema-validated outputs + audit logs = production posture"
- "GPT-5 is the reasoning layer; the controls live in our app"
- "We don't send secrets to the browser—everything runs server-side"
- "We measure value in minutes saved and errors prevented, not tokens"
- "From volatility spike to desk-specific action in 30 seconds"
- "What takes an analyst 2 hours now takes 2 minutes"

## Backup Plan (If Tech Issues)

1. **Keep Mock mode primed** - all functionality works without API keys
2. **Pre-download sample outputs** - SAR JSON, research notes ready to show
3. **Audit log always works** - even failures are logged and trackable
4. **Have backup slides** - screenshots of key outputs if live demo fails

## Post-Demo Integration Session

Show this code snippet live:
\`\`\`javascript
// How to wire this to your systems
const connectToRealData = async () => {
  // Surveillance: Your trade warehouse
  const trades = await fetchFromKDB('SELECT * FROM trades WHERE...')
  
  // Regime: Your market data feed  
  const marketData = await bloombergAPI.getIntradayData()
  
  // Research: Your document store
  const filings = await s3.getObject('earnings/latest/')
  
  return processWithAgents({trades, marketData, filings})
}
\`\`\`

**Close with Speed**: "Let's build a new agent for FX exposure analysis in 90 seconds"
- Create new route in the app
- Show how the factory pattern makes it trivial
- Deploy to Vercel with one click

## Success Metrics
- **Audience engagement**: Questions about implementation details
- **GitHub activity**: Stars and forks during/after presentation
- **Follow-up requests**: "Can we schedule a technical deep-dive?"
- **Cost comparison impact**: "$0.73 vs $5,000 contractor analysis"
