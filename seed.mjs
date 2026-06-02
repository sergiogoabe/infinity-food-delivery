import { hash } from "bcryptjs"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const DB_PATH = join(process.cwd(), "data.json")

async function seed() {
  console.log("🌱 Seeding database...")

  const hashedPassword = await hash("123456", 12)

  const data = {
    users: [
      { id: "user-1", name: "Admin Pizza", email: "admin@pizza.com", password: hashedPassword, phone: "37999990001", role: "owner", image: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "user-2", name: "Admin Burguer", email: "admin@burguer.com", password: hashedPassword, phone: "37999990002", role: "owner", image: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "user-3", name: "João Cliente", email: "joao@email.com", password: hashedPassword, phone: "37999990003", role: "customer", image: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    stores: [
      { id: "store-1", name: "Pizzaria do Centro", slug: "pizzaria-do-centro", description: "A melhor pizza de Divinópolis", address: "Rua Rio de Janeiro, 500, Centro", latitude: -20.1390, longitude: -44.8838, phone: "3733211234", image: null, coverImage: null, category: "pizzas", isActive: true, deliveryFee: 5, freeDeliveryMin: 50, ownerId: "user-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "store-2", name: "Burguer King Delícias", slug: "burguer-king-delicias", description: "Hambúrgueres artesanais", address: "Av. Getúlio Vargas, 200, Centro", latitude: -20.1370, longitude: -44.8800, phone: "3733215678", image: null, coverImage: null, category: "lanches", isActive: true, deliveryFee: 4, freeDeliveryMin: null, ownerId: "user-2", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    products: [
      { id: "prod-1", name: "Pizza Margherita", description: "Molho de tomate, mussarela, manjericão", price: 35.90, image: null, category: "Pizzas Salgadas", isAvailable: true, storeId: "store-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "prod-2", name: "Pizza Calabresa", description: "Calabresa, cebola, azeitona", price: 38.90, image: null, category: "Pizzas Salgadas", isAvailable: true, storeId: "store-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "prod-3", name: "Pizza Portuguesa", description: "Presunto, mussarela, ovo, cebola", price: 42.90, image: null, category: "Pizzas Salgadas", isAvailable: true, storeId: "store-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "prod-4", name: "Coca-Cola 2L", description: "Refrigerante Coca-Cola 2 litros", price: 10.00, image: null, category: "Bebidas", isAvailable: true, storeId: "store-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "prod-5", name: "X-Burguer", description: "Hambúrguer 180g, queijo, alface, tomate", price: 22.90, image: null, category: "Hambúrgueres", isAvailable: true, storeId: "store-2", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "prod-6", name: "X-Salada", description: "Hambúrguer 180g, queijo, alface, tomate, maionese", price: 24.90, image: null, category: "Hambúrgueres", isAvailable: true, storeId: "store-2", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "prod-7", name: "Batata Frita", description: "Porção de batata frita crocante 300g", price: 15.90, image: null, category: "Porções", isAvailable: true, storeId: "store-2", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "prod-8", name: "Suco Natural de Laranja", description: "Suco de laranja natural 500ml", price: 8.00, image: null, category: "Bebidas", isAvailable: true, storeId: "store-2", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    orders: [],
    orderItems: [],
    reviews: [],
  }

  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
  console.log("✅ Seed concluído! Dados salvos em data.json")
  console.log("   📧 admin@pizza.com / 123456 (Pizzaria do Centro)")
  console.log("   📧 admin@burguer.com / 123456 (Burguer King Delícias)")
  console.log("   📧 joao@email.com / 123456 (Cliente)")
}

seed().catch(console.error)
