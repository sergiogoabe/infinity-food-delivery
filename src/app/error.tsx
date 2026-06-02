"use client"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-secondary mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-500 mb-6">Tente recarregar a página</p>
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}
