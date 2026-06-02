import Link from "next/link"
import { Store, Bike, Clock, TrendingUp, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary leading-tight mb-6">
              Peça online.
              <br />
              <span className="text-primary">Receba em casa.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              O delivery mais rápido de Divinópolis. Escolha entre os melhores restaurantes,
              faça seu pedido e receba no conforto da sua casa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/stores"
                className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
              >
                Ver Lojas
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Cadastre sua Loja
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">
            Por que escolher a Infinity Food?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Melhores Restaurantes</h3>
              <p className="text-gray-600">Selecionamos os melhores estabelecimentos de Divinópolis para você.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Entregadores dedicados para levar seu pedido com rapidez e segurança.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rastreamento em Tempo Real</h3>
              <p className="text-gray-600">Acompanhe seu pedido do preparo até a entrega em tempo real.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">
                Seja um parceiro Infinity Food
              </h2>
              <ul className="space-y-4">
                {[
                  "Aumente suas vendas com alcance digital",
                  "Painel exclusivo para gerenciar pedidos em tempo real",
                  "Notificações no Telegram a cada novo pedido",
                  "Sistema de fretes inteligente por distância",
                  "Divulgação nos nossos canais de marketing",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="inline-block mt-8 bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Quero vender na Infinity
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-2xl text-white">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">+40% de alcance</h3>
              <p className="text-white/80">
                Lojas parceiras aumentam em média 40% suas vendas nos primeiros 3 meses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Divinópolis na palma da mão</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Estamos construindo o maior ecossistema de delivery da cidade.
            Faça parte dessa revolução.
          </p>
          <Link
            href="/stores"
            className="bg-primary text-white px-10 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors inline-block"
          >
            Pedir Agora
          </Link>
        </div>
      </section>
    </div>
  )
}
