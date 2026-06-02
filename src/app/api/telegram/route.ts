import { NextRequest, NextResponse } from "next/server"
import { sendTelegramNotification } from "@/lib/telegram"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 })
    }

    const ok = await sendTelegramNotification(message)
    return NextResponse.json({ ok })
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
