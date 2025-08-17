import AppShell from "@/components/ui/app-shell"
import { AgentCard } from "@/components/AgentCard"

export default function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900">Capital Markets Agent Factory</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            AI-powered agents for institutional trading and compliance workflows
          </p>
        </div>

        <section aria-label="Capital Markets Overview" className="bg-slate-50 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">What are Capital Markets?</h2>
          <p className="text-slate-700">
            Capital markets facilitate the raising of financing through <strong>equity</strong> (ownership stakes) and{" "}
            <strong>debt</strong> (loans/bonds). Companies access these markets to fund growth, while investors seek
            returns through trading securities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h3 className="font-medium text-slate-900">AI Applications:</h3>
              <ul className="text-slate-600 space-y-1">
                <li>• Automated research & analysis</li>
                <li>• Risk monitoring & compliance</li>
                <li>• Trading pattern detection</li>
                <li>• Regulatory filing processing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-slate-900">Key Processes:</h3>
              <ul className="text-slate-600 space-y-1">
                <li>• IPO & S-1 filing analysis</li>
                <li>• Credit & fraud risk assessment</li>
                <li>• KYC & due diligence</li>
                <li>• Market regime detection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Core Agents */}
        <section aria-label="Core Agents" className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Core Agents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              title="Research Note"
              body="Generate institutional-grade research notes from 8-K/10-Q filings."
              tags={["PDF Analysis", "KPI Extraction", "Mgmt Quotes", "Citations"]}
              href="/research"
            />
            <AgentCard
              title="Surveillance"
              body="Monitor trading patterns and generate SAR-compliant memos."
              tags={["Pattern Detection", "Compliance Metrics", "SAR Generation"]}
              href="/surveillance"
            />
            <AgentCard
              title="Regime & Hedge"
              body="Detect regime changes and generate hedge recommendations by desk."
              tags={["Regime Detection", "Correlation", "Risk Metrics"]}
              href="/regime"
            />
          </div>
        </section>

        <section aria-label="Valuation & Comps" className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Valuation & Comps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              title="Debt Comps"
              body="Analyze comparable debt instruments and pricing across markets."
              tags={["Credit Analysis", "Yield Curves", "Spread Analysis"]}
              href="/debt-comps"
            />
            <AgentCard
              title="Equity Comps"
              body="Generate equity comparables and valuation multiples analysis."
              tags={["P/E Ratios", "EV/EBITDA", "Sector Analysis"]}
              href="/equity-comps"
            />
            <AgentCard
              title="IPO Analysis"
              body="Streamline S-1 filing analysis with accuracy and compliance metrics."
              tags={["S-1 Processing", "Valuation Metrics", "Compliance Check"]}
              href="/ipo-analysis"
            />
          </div>
        </section>

        <section aria-label="Utility Tools" className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Back Office & Risk Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              title="KYC & Due Diligence"
              body="Automated research on individuals and businesses with socio-economic and geopolitical risk factors."
              tags={["Identity Verification", "Risk Assessment", "Geopolitical Analysis"]}
              href="/kyc"
            />
            <AgentCard
              title="Credit & Fraud Risk"
              body="Automated credit scoring and fraud detection with evaluation metrics."
              tags={["Credit Scoring", "Fraud Detection", "Risk Evaluation"]}
              href="/credit-risk"
            />
            <AgentCard
              title="Filing Compliance"
              body="Process 10-K, 10-Q, and other regulatory filings with accuracy metrics."
              tags={["10-K Analysis", "10-Q Processing", "Compliance Metrics"]}
              href="/filing-compliance"
            />
            <AgentCard
              title="Reg Impact"
              body="Analyze regulatory changes and map impact across trading desks."
              tags={["Regulatory Analysis", "Desk Mapping", "Impact Assessment"]}
              href="/reg-impact"
            />
            <AgentCard
              title="Client Brief"
              body="Generate meeting briefs and talking points for client interactions."
              tags={["Meeting Prep", "Talking Points", "Cross-sell Ideas"]}
              href="/client"
            />
            <AgentCard
              title="Knowledge"
              body="Upload and manage documents for agent knowledge base."
              tags={["Document Upload", "Knowledge Base", "File Management"]}
              href="/knowledge"
            />
          </div>
        </section>
      </div>
    </AppShell>
  )
}
