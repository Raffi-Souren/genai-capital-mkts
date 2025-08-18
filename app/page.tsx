import AppShell from "@/components/ui/app-shell"
import { AgentCard } from "@/components/AgentCard"
import { GlobalHeaderChips } from "@/components/global-header-chips"

export default function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Global Header Chips */}
        <GlobalHeaderChips />

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900">Capital Markets Agent Factory</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            AI-powered agents for institutional trading and compliance workflows
          </p>
        </div>

        {/* Core Agents */}
        <section aria-label="Core Agents" className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Core Agents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              title="Research Note"
              body="Generate institutional-grade research notes from 8-K/10-Q filings."
              tags={["PDF Analysis", "KPI Extraction", "Mgmt Quotes", "Citations"]}
              href="/research"
              status="ready"
            />
            <AgentCard
              title="Surveillance"
              body="Monitor trading patterns and generate SAR-compliant memos."
              tags={["Pattern Detection", "Compliance Metrics", "SAR Generation"]}
              href="/surveillance"
              status="ready"
            />
            <AgentCard
              title="Regime & Hedge"
              body="Detect regime changes and generate hedge recommendations by desk."
              tags={["Regime Detection", "Correlation", "Risk Metrics"]}
              href="/regime"
              status="ready"
            />
            <AgentCard
              title="Meetings Analysis"
              body="Analyze earnings calls and meeting transcripts for key insights and sentiment."
              tags={["Transcript Analysis", "Earnings Calls", "Sentiment Analysis", "Key Insights"]}
              href="/meetings"
              status="ready"
            />
          </div>
        </section>

        {/* Capital Markets Overview */}
        <section aria-label="Capital Markets Overview" className="bg-slate-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900">What are Capital Markets?</h2>
          <p className="text-slate-700">
            Capital markets facilitate raising financing through equity (ownership stakes) and debt (loans/bonds), with
            AI now automating research, compliance, risk monitoring, and regulatory analysis.
          </p>
        </section>

        {/* Valuation & Comps */}
        <section aria-label="Valuation & Comps" className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Valuation & Comps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              title="Debt Comps"
              body="Analyze comparable debt instruments and pricing across markets."
              tags={["Credit Analysis", "Yield Curves", "Spread Analysis"]}
              href="/debt-comps"
              status="coming-soon"
            />
            <AgentCard
              title="Equity Comps"
              body="Generate equity comparables and valuation multiples analysis."
              tags={["P/E Ratios", "EV/EBITDA", "Sector Analysis"]}
              href="/equity-comps"
              status="coming-soon"
            />
            <AgentCard
              title="IPO Analysis"
              body="Streamline S-1 filing analysis with accuracy and compliance metrics."
              tags={["S-1 Processing", "Valuation Metrics", "Compliance Check"]}
              href="/ipo-analysis"
              status="coming-soon"
            />
          </div>
        </section>

        {/* Utility Tools */}
        <section aria-label="Utility Tools" className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Back Office & Risk Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              title="KYC & Due Diligence"
              body="Automated research on individuals and businesses with socio-economic and geopolitical risk factors."
              tags={["Identity Verification", "Risk Assessment", "Geopolitical Analysis"]}
              href="/kyc"
              status="coming-soon"
            />
            <AgentCard
              title="Credit & Fraud Risk"
              body="Automated credit scoring and fraud detection with evaluation metrics."
              tags={["Credit Scoring", "Fraud Detection", "Risk Evaluation"]}
              href="/credit-risk"
              status="ready"
            />
            <AgentCard
              title="Filing Compliance"
              body="Process 10-K, 10-Q, and other regulatory filings with accuracy metrics."
              tags={["10-K Analysis", "10-Q Processing", "Compliance Metrics"]}
              href="/filing-compliance"
              status="coming-soon"
            />
            <AgentCard
              title="Reg Impact"
              body="Analyze regulatory changes and map impact across trading desks."
              tags={["Regulatory Analysis", "Desk Mapping", "Impact Assessment"]}
              href="/reg-impact"
              status="ready"
            />
            <AgentCard
              title="Client Brief"
              body="Generate meeting briefs and talking points for client interactions."
              tags={["Meeting Prep", "Talking Points", "Cross-sell Ideas"]}
              href="/client"
              status="ready"
            />
            <AgentCard
              title="Knowledge"
              body="Upload and manage documents for agent knowledge base."
              tags={["Document Upload", "Knowledge Base", "File Management"]}
              href="/knowledge"
              status="ready"
            />
          </div>
        </section>
      </div>
    </AppShell>
  )
}
