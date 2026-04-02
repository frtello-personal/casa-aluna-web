export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-700">Casa Aluna</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Alquiler Vacacional en Colombia
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
            Reserva directamente sin comisiones. Encuentra tu alojamiento perfecto para tus próximas vacaciones.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              🚀 Proyecto Inicializado
            </h3>
            <p className="text-gray-600 mb-4">
              El proyecto Casa Aluna ha sido configurado exitosamente con:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
              <li>✅ Next.js 16 con App Router</li>
              <li>✅ TypeScript (modo estricto)</li>
              <li>✅ Tailwind CSS configurado</li>
              <li>✅ ESLint</li>
              <li>✅ Estructura de directorios según MEMORY_BANK</li>
              <li>✅ Componentes base creados</li>
              <li>✅ Configuración de WhatsApp y Analytics</li>
            </ul>
          </div>

          <div className="text-gray-600">
            <p className="mb-2">
              <strong>Siguiente paso:</strong> Comienza a desarrollar las funcionalidades de Phase 1
            </p>
            <p className="text-sm">
              Consulta el <code className="bg-gray-100 px-2 py-1 rounded">MEMORY_BANK.md</code> para más detalles
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>Casa Aluna - Plataforma de Reservas Directas © 2026</p>
        </div>
      </footer>
    </div>
  );
}
