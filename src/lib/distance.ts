export async function calculateDeliveryFee(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<{ distance: number; fee: number; duration: number }> {
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

    return { distance: Math.round(distanceKm * 10) / 10, fee, duration: durationMin }
  } catch {
    const dummyDistance = Math.round(Math.random() * 10 + 1)
    return {
      distance: dummyDistance,
      fee: Math.round(5 + dummyDistance * 1.5),
      duration: Math.round(dummyDistance * 5),
    }
  }
}
