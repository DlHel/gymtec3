export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Gymtec ERP</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Tickets Abiertos</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500">+2 desde ayer</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Clientes Activos</h3>
          <p className="text-3xl font-bold text-green-600">45</p>
          <p className="text-sm text-gray-500">+3 este mes</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Equipos Registrados</h3>
          <p className="text-3xl font-bold text-purple-600">128</p>
          <p className="text-sm text-gray-500">En 15 ubicaciones</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600">8</p>
          <p className="text-sm text-gray-500">Repuestos críticos</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold mb-4">Tickets Recientes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Mantenimiento Cinta Trotadora</p>
                <p className="text-sm text-gray-600">Cliente: Gimnasio Central</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                En Progreso
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Reparación Bicicleta Estática</p>
                <p className="text-sm text-gray-600">Cliente: Fitness Plus</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                Completado
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm">Nuevo ticket creado por Juan Pérez</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">Ticket #123 marcado como completado</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm">Stock de repuesto XYZ bajo mínimo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 