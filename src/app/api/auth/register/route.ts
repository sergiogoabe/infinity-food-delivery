import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { getDb } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role, storeName, storeAddress } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || "customer",
      },
    })

    if (role === "owner" && storeName) {
      await db.store.create({
        data: {
          name: storeName,
          slug: storeName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
          address: storeAddress || "",
          ownerId: user.id,
        },
      })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
