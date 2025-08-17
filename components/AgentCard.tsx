import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AgentCard({
  title,
  body,
  tags,
  href,
}: {
  title: string
  body: string
  tags: string[]
  href: string
}) {
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
        <span className="text-xs text-emerald-600">Ready</span>
        <Button asChild className="px-4 bg-[#0047AB] hover:bg-[#003d99] text-white">
          <Link href={href}>Launch Agent</Link>
        </Button>
      </div>
    </div>
  )
}
