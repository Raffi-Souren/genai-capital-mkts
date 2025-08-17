"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useMode } from "@/components/mode-provider"
import { Bot, Database } from "lucide-react"

export function ModeToggle() {
  const { mode, setMode, isLiveAvailable } = useMode()

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center space-x-2">
        <Database className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          Mock
        </Label>
        <Switch
          id="mode-toggle"
          checked={mode === "live"}
          onCheckedChange={(checked) => setMode(checked ? "live" : "mock")}
          disabled={!isLiveAvailable}
        />
        <Label htmlFor="mode-toggle" className="text-sm font-medium">
          Live
        </Label>
        <Bot className="h-4 w-4 text-muted-foreground" />
      </div>

      <Badge variant={mode === "live" ? "default" : "secondary"} className="font-mono">
        {mode.toUpperCase()}
        {mode === "live" && !isLiveAvailable && " (Fallback)"}
      </Badge>

      {!isLiveAvailable && (
        <Badge variant="outline" className="text-xs">
          LLM: Unavailable
        </Badge>
      )}
    </div>
  )
}
