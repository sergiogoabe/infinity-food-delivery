import { Client } from "pg"
import { hash } from "bcryptjs"

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_P9VdkAIN2UER@ep-falling-cake-apejdukm-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"

async function seed() {
  console.log("🌱 Populando banco de dados PostgreSQL (Neon)...")
  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()

  const hashedPassword = await hash("123456", 12)

  // Users
  const now = new Date().toISOString()
  await client.query(`INSERT INTO "User" (id, name, email, password, phone, role, "createdAt", "updatedAt") VALUES
    ('user-1', 'Admin Pizza', 'admin@pizza.com', $1, '37999990001', 'owner', $2, $2),
    ('user-2', 'Admin Burguer', 'admin@burguer.com', $1, '37999990002', 'owner', $2, $2),
    ('user-3', 'João Cliente', 'joao@email.com', $1, '37999990003', 'customer', $2, $2)
  ON CONFLICT (email) DO NOTHING`, [hashedPassword, now])
  console.log("  ✓ Usuários criados")

  // Stores
  const now2 = new Date().toISOString()
  await client.query(`INSERT INTO "Store" (id, name, slug, description, address, latitude, longitude, phone, category, "isActive", "deliveryFee", "freeDeliveryMin", "ownerId", "createdAt", "updatedAt") VALUES
    ('store-1', 'Pizzaria do Centro', 'pizzaria-do-centro', 'A melhor pizza de Divinópolis', 'Rua Rio de Janeiro, 500, Centro', -20.139, -44.8838, '3733211234', 'pizzas', true, 5, 50, 'user-1', $1, $1),
    ('store-2', 'Burguer King Delícias', 'burguer-king-delicias', 'Hambúrgueres artesanais', 'Av. Getúlio Vargas, 200, Centro', -20.137, -44.88, '3733215678', 'lanches', true, 4, NULL, 'user-2', $1, $1)
  ON CONFLICT (id) DO NOTHING`, [now2])
  console.log("  ✓ Lojas criadas")

  // Products
  const now3 = new Date().toISOString()
  await client.query(`INSERT INTO "Product" (id, name, description, price, category, "isAvailable", "storeId", "createdAt", "updatedAt") VALUES
    ('prod-1', 'Pizza Margherita', 'Molho de tomate, mussarela, manjericão', 35.90, 'Pizzas Salgadas', true, 'store-1', $1, $1),
    ('prod-2', 'Pizza Calabresa', 'Calabresa, cebola, azeitona', 38.90, 'Pizzas Salgadas', true, 'store-1', $1, $1),
    ('prod-3', 'Pizza Portuguesa', 'Presunto, mussarela, ovo, cebola', 42.90, 'Pizzas Salgadas', true, 'store-1', $1, $1),
    ('prod-4', 'Coca-Cola 2L', 'Refrigerante Coca-Cola 2 litros', 10.00, 'Bebidas', true, 'store-1', $1, $1),
    ('prod-5', 'X-Burguer', 'Hambúrguer 180g, queijo, alface, tomate', 22.90, 'Hambúrgueres', true, 'store-2', $1, $1),
    ('prod-6', 'X-Salada', 'Hambúrguer 180g, queijo, alface, tomate, maionese', 24.90, 'Hambúrgueres', true, 'store-2', $1, $1),
    ('prod-7', 'Batata Frita', 'Porção de batata frita crocante 300g', 15.90, 'Porções', true, 'store-2', $1, $1),
    ('prod-8', 'Suco Natural de Laranja', 'Suco de laranja natural 500ml', 8.00, 'Bebidas', true, 'store-2', $1, $1)
  ON CONFLICT (id) DO NOTHING`, [now3])
  console.log("  ✓ Produtos criados")

  await client.end()
  console.log("\n✅ Seed concluído!")
  console.log("   📧 admin@pizza.com / 123456 (Pizzaria do Centro)")
  console.log("   📧 admin@burguer.com / 123456 (Burguer King Delícias)")
  console.log("   📧 joao@email.com / 123456 (Cliente)")
}

seed().catch(console.error)
