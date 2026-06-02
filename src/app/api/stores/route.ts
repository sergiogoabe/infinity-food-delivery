import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const stores = await db.store.findMany({
      where: { isActive: true },
      include: {
        products: true,
        _count: true,
        reviews: true,
      },
    })

    const formatted = stores.map((store: any) => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      address: store.address,
      latitude: store.latitude,
      longitude: store.longitude,
      phone: store.phone,
      image: store.image,
      coverImage: store.coverImage,
      category: store.category || "all",
      isActive: store.isActive,
      deliveryFee: store.deliveryFee,
      freeDeliveryMin: store.freeDeliveryMin,
      ownerId: store.ownerId,
      products: store.products || [],
      reviewCount: store.reviews?.length || 0,
      avgRating: store.reviews?.length
        ? store.reviews.reduce((a: number, r: any) => a + r.rating, 0) / store.reviews.length
        : null,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 })
  }
}
