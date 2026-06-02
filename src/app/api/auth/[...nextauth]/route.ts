import { getHandlers } from "@/lib/auth"

export async function GET(req: Request) {
  const handlers = await getHandlers()
  return handlers.GET(req)
}

export async function POST(req: Request) {
  const handlers = await getHandlers()
  return handlers.POST(req)
}
