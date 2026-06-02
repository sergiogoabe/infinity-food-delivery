import { Client } from "pg"

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_P9VdkAIN2UER@ep-falling-cake-apejdukm-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

async function pushSchema() {
  console.log("🚀 Conectando ao PostgreSQL (Neon)...")
  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()
  console.log("✅ Conectado!")

  const sql = `
    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      image TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Store" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      address TEXT NOT NULL,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      phone TEXT,
      image TEXT,
      coverImage TEXT,
      category TEXT DEFAULT 'all',
      "isActive" BOOLEAN DEFAULT true,
      "deliveryFee" DOUBLE PRECISION DEFAULT 5.0,
      "freeDeliveryMin" DOUBLE PRECISION,
      "ownerId" TEXT UNIQUE NOT NULL REFERENCES "User"(id),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Product" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price DOUBLE PRECISION NOT NULL,
      image TEXT,
      category TEXT,
      "isAvailable" BOOLEAN DEFAULT true,
      "storeId" TEXT NOT NULL REFERENCES "Store"(id) ON DELETE CASCADE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Order" (
      id TEXT PRIMARY KEY,
      status TEXT DEFAULT 'pending',
      total DOUBLE PRECISION NOT NULL,
      "deliveryFee" DOUBLE PRECISION DEFAULT 0,
      subtotal DOUBLE PRECISION NOT NULL,
      address TEXT NOT NULL,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      "paymentMethod" TEXT DEFAULT 'cash',
      notes TEXT,
      "userId" TEXT NOT NULL REFERENCES "User"(id),
      "storeId" TEXT NOT NULL REFERENCES "Store"(id),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "OrderItem" (
      id TEXT PRIMARY KEY,
      quantity INTEGER NOT NULL,
      price DOUBLE PRECISION NOT NULL,
      "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
      "productId" TEXT NOT NULL REFERENCES "Product"(id)
    );

    CREATE TABLE IF NOT EXISTS "Review" (
      id TEXT PRIMARY KEY,
      rating INTEGER NOT NULL,
      comment TEXT,
      "userId" TEXT NOT NULL REFERENCES "User"(id),
      "storeId" TEXT NOT NULL REFERENCES "Store"(id) ON DELETE CASCADE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("userId", "storeId")
    );
  `

  const statements = sql.split(";").filter(s => s.trim())

  for (const stmt of statements) {
    try {
      await client.query(stmt + ";")
      console.log("  ✓ Tabela criada/verificada")
    } catch (err) {
      console.error("  ✗ Erro:", err?.message || err)
    }
  }

  await client.end()
  console.log("\n✅ Schema enviado para Neon PostgreSQL com sucesso!")
}

pushSchema().catch(console.error)
