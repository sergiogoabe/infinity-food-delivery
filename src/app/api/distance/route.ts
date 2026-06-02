import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const originLat = req.nextUrl.searchParams.get("originLat")
  const originLng = req.nextUrl.searchParams.get("originLng")
  const destLat = req.nextUrl.searchParams.get("destLat")
  const destLng = req.nextUrl.searchParams.get("destLng")

  if (!originLat || !originLng || !destLat || !destLng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 })
  }

  const osrmUrl = process.env.NEXT_PUBLIC_OSRM_URL || "https://router.project-osrm.org"

  try {
    const res = await fetch(
      `${osrmUrl}/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) throw new Error("OSRM request failed")

    const data = await res.json()
    const distanceKm = data.routes[0].distance / 1000
    const durationMin = Math.round(data.routes[0].duration / 60)

    const baseFee = 5
    const perKmRate = 1.5
    const fee = Math.round(baseFee + distanceKm * perKmRate)

    return NextResponse.json({
      distance: Math.round(distanceKm * 10) / 10,
      fee,
      duration: durationMin,
    })
  } catch {
    return NextResponse.json({ error: "Failed to calculate distance" }, { status: 500 })
  }
}
