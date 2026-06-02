const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

export async function sendTelegramNotification(message: string): Promise<boolean> {
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!chatId) return false

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function formatOrderNotification(order: {
  id: string
  storeName: string
  customerName: string
  items: string
  total: number
  address: string
}) {
  return `
<b>🛵 Novo Pedido - Infinity Food Delivery</b>

<b>Pedido:</b> #${order.id.slice(-6).toUpperCase()}
<b>Loja:</b> ${order.storeName}
<b>Cliente:</b> ${order.customerName}
<b>Itens:</b> ${order.items}
<b>Total:</b> R$ ${order.total.toFixed(2)}
<b>Endereço:</b> ${order.address}

<a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${order.id}">Ver Pedido</a>
  `.trim()
}
