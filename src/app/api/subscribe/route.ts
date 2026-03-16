import { NextResponse } from "next/server"

const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === "string" ? body.email.trim() : ""

    if (!email || !email.includes("@") || email.length > 320) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    // If Buttondown is configured, forward the subscription
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
        // Buttondown returns 400 for already-subscribed emails
        if (res.status === 400 && JSON.stringify(data).includes("already")) {
          return NextResponse.json({ message: "You're already subscribed." })
        }
        console.error("Buttondown error:", data)
        return NextResponse.json(
          { error: "Subscription failed. Please try again." },
          { status: 502 }
        )
      }

      return NextResponse.json({ message: "Subscribed successfully." })
    }

    // Fallback: log to console when no email provider is configured
    // In production, replace with your preferred storage
    console.log(`[subscribe] New subscriber: ${email} at ${new Date().toISOString()}`)
    return NextResponse.json({ message: "Subscribed successfully." })
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    )
  }
}
