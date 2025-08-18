"use client"

import { Button } from "@/components/ui/button"
import { Upload, Play, Wand2 } from "lucide-react"

interface TopActionsProps {
  onUseSample: () => void
  onUpload: () => void
  onGenerate: () => void
  loading?: boolean
}

export function TopActions({ onUseSample, onUpload, onGenerate, loading }: TopActionsProps) {
  return (
    <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border">
      <Button onClick={onUseSample} disabled={loading} className="bg-ibm-blue hover:bg-ibm-blue-dark text-white">
        <Play className="w-4 h-4 mr-2" />
        Use Sample
      </Button>
      <Button variant="outline" onClick={onUpload} disabled={loading}>
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>
      <Button variant="outline" onClick={onGenerate} disabled={loading}>
        <Wand2 className="w-4 h-4 mr-2" />
        Generate
      </Button>
    </div>
  )
}
