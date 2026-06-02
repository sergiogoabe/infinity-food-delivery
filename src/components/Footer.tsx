import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-secondary text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-primary">Infinity</span>
              <span className="text-xl font-semibold text-white">Food</span>
            </div>
            <p className="text-sm text-gray-400">
              A plataforma de delivery mais moderna de Divinópolis. Peça comida dos melhores restaurantes da cidade.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Para Clientes</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/stores" className="hover:text-primary transition-colors">Lojas</Link></li>
              <li><Link href="/cart" className="hover:text-primary transition-colors">Carrinho</Link></li>
              <li><Link href="/auth/login" className="hover:text-primary transition-colors">Minha Conta</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Para Lojistas</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/register" className="hover:text-primary transition-colors">Cadastre sua Loja</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Painel do Lojista</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Infinity Agency</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/agency" className="hover:text-primary transition-colors">Sobre a Agência</Link></li>
              <li><span className="text-gray-400">contato@infinityagency.com</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Infinity Food Delivery. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
