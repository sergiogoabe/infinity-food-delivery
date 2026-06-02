import Link from "next/link"
import { Globe, Smartphone, Code2, BarChart3, ShoppingCart, CheckCircle } from "lucide-react"

export default function AgencyPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-secondary to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="text-primary font-semibold mb-2">Infinity Agency</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Transformamos seu negócio
              <br />
              <span className="text-primary">em plataforma digital</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Criamos soluções digitais completas para pequenos e médios empresários.
              De marketplaces a sistemas personalizados, sua ideia no ar em tempo recorde.
            </p>
            <Link
              href="/auth/register"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors inline-block"
            >
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary mb-4">Nossos Produtos</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Soluções completas para digitalizar seu negócio
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: "Infinity Food Delivery",
                desc: "Plataforma completa de delivery para sua cidade. Concorra com iFood com sua própria marca.",
                features: [
                  "Catálogo online com cardápio digital",
                  "Cálculo de frete inteligente",
                  "Painel do lojista em tempo real",
                  "Notificações por Telegram",
                  "Rastreamento de pedidos",
                ],
                href: "/",
              },
              {
                icon: Globe,
                title: "Sites Institucionais",
                desc: "Sites profissionais com design moderno e responsivo para sua empresa.",
                features: [
                  "Design exclusivo e responsivo",
                  "otimizado para SEO",
                  "Painel administrativo",
                  "Integração com redes sociais",
                  "Hospedagem inclusa",
                ],
                href: "#",
              },
              {
                icon: Code2,
                title: "Sistemas Sob Medida",
                desc: "Sistemas personalizados para automatizar e escalar seu negócio.",
                features: [
                  "Análise de requisitos",
                  "Desenvolvimento ágil",
                  "API e integrações",
                  "Banco de dados escalável",
                  "Suporte contínuo",
                ],
                href: "#",
              },
            ].map((product, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <product.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{product.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{product.desc}</p>
                <ul className="space-y-2 mb-6">
                  {product.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={product.href}
                  className="text-primary font-semibold hover:underline text-sm"
                >
                  Saiba mais →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-6">Por que a Infinity Agency?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { num: "Rápido", desc: "Projetos entregues em semanas, não meses" },
              { num: "Acessível", desc: "Soluções com preços justos para pequenos empresários" },
              { num: "Completo", desc: "Do planejamento ao deploy e suporte" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-3xl font-bold text-primary mb-2">{item.num}</p>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Vamos transformar seu negócio?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Entre em contato e descubra como podemos ajudar sua empresa a crescer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/register"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Solicitar Orçamento
            </Link>
            <a
              href="mailto:contato@infinityagency.com"
              className="bg-white text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              contato@infinityagency.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
