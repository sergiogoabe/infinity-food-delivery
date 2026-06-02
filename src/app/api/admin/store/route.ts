import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()
    const db = await getDb()
    const store = await db.store.findUnique({
      where: { ownerId: session.user.id },
    })
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    const updated = await db.store.update({
      where: { id: store.id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        deliveryFee: data.deliveryFee,
        freeDeliveryMin: data.freeDeliveryMin,
        category: data.category,
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 })
  }
}
