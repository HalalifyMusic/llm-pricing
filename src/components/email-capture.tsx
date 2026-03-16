"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Bell, Check, Loader2 } from "lucide-react"

interface EmailCaptureProps {
  className?: string
}

export function EmailCapture({ className }: EmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.")
      setStatus("error")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Subscription failed")
      }

      setStatus("success")
      setEmail("")
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className={className}>
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-300">
            You&apos;re subscribed. We&apos;ll email you when prices change.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-border/50 bg-muted/10 px-4 py-3 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4 shrink-0" />
          <span>Get notified when prices change</span>
        </div>
        <div className="flex flex-1 gap-2 sm:justify-end">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === "error") setStatus("idle")
            }}
            className="h-8 max-w-xs text-sm"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : null}
            Subscribe
          </button>
        </div>
      </form>
      {status === "error" && errorMessage && (
        <p className="mt-1 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  )
}
