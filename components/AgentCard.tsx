import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AgentCard({
  title,
  body,
  tags,
  href,
  status = "ready",
}: {
  title: string
  body: string
  tags: string[]
  href: string
  status?: "ready" | "coming-soon" | "beta"
}) {
  const getStatusBadge = () => {
    switch (status) {
      case "ready":
        return (
          <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
            Ready
          </Badge>
        )
      case "coming-soon":
        return (
          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
            Coming Soon
          </Badge>
        )
      case "beta":
        return (
          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
            Beta
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
            Ready
          </Badge>
        )
    }
  }

  const isDisabled = status === "coming-soon"

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-700">{body}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {getStatusBadge()}
        {isDisabled ? (
          <Button disabled className="px-4 bg-slate-300 text-slate-500 cursor-not-allowed">
            Coming Soon
          </Button>
        ) : (
          <Button asChild className="px-4 bg-[#0047AB] hover:bg-[#003d99] text-white">
            <Link href={href}>Launch Agent</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
