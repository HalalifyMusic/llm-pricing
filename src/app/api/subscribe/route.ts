import { NextResponse } from "next/server"

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY

// Simple in-memory rate limiter: max 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }

  if (entry.count >= 5) return true

  rateLimitMap.set(ip, { count: entry.count + 1, resetAt: entry.resetAt })
  return false
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email || !EMAIL_REGEX.test(email) || email.length > 320) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    if (BUTTONDOWN_API_KEY) {
      const res = await fetch("https://api.buttondown.com/v1/subscribers", {
        method: "POST",
        headers: {
          Authorization: `Token ${BUTTONDOWN_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          type: "regular",
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 400 && JSON.stringify(data).includes("already")) {
          return NextResponse.json({ message: "You're already subscribed." })
        }
        return NextResponse.json(
          { error: "Subscription failed. Please try again." },
          { status: 502 }
        )
      }

      return NextResponse.json({ message: "Subscribed successfully." })
    }

    // No email provider configured — accept silently without logging PII
    return NextResponse.json({ message: "Subscribed successfully." })
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    )
  }
}
