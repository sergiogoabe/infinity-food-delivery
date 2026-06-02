import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "@/components/SessionProvider"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "Infinity Food Delivery - Peça online, receba em casa",
  description:
    "Plataforma de delivery de comida em Divinópolis. Peça dos melhores restaurantes e receba no conforto da sua casa.",
  keywords: "delivery, comida, divinópolis, restaurante, ifood, infinity food",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#1e293b", color: "#fff", borderRadius: "8px" },
              success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
              error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
