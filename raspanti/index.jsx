
export default function AEVHome() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r p-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-violet-700">AEV</h1>
          <p className="text-sm text-slate-500">
            Analizador de Ecosistemas Virtuales
          </p>
        </div>

        <nav className="space-y-3">
          <button className="w-full text-left p-3 rounded-xl bg-violet-100 text-violet-700">
            Inicio
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-100">
            Nuevo análisis
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-100">
            Mis análisis
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-100">
            Reportes
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-100">
            Biblioteca NEA
          </button>

          <button className="w-full text-left p-3 rounded-xl hover:bg-slate-100">
            Guía Accestética
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">

        <div className="mb-10">
          <h1 className="text-5xl font-bold">
            Bienvenida al{" "}
            <span className="text-violet-600">
              AEV
            </span>
          </h1>

          <p className="mt-4 text-slate-600 max-w-3xl">
            Evaluá la habitabilidad pedagógica,
            detectá barreras y transformá tus
            entornos virtuales en experiencias
            accesibles, comprensibles y significativas.
          </p>
        </div>

        {/* Upload */}

        <div className="bg-white rounded-3xl border p-8 mb-8">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-2xl font-semibold">
                ¿Qué querés analizar hoy?
              </h2>

              <p className="text-slate-500">
                Subí un PDF, Word o pegá un texto.
              </p>
            </div>

            <button className="bg-violet-600 text-white px-6 py-3 rounded-xl">
              Nuevo análisis
            </button>

          </div>

          <div className="border-2 border-dashed border-violet-300 rounded-2xl p-12 text-center">

            <h3 className="font-medium text-lg">
              Arrastrá tu archivo aquí
            </h3>

            <p className="text-slate-500 mt-2">
              Moodle, Classroom, PDF, Word o enlaces.
            </p>

          </div>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-3xl border p-6">

            <h3 className="font-semibold mb-4">
              Índice de Habitabilidad Pedagógica
            </h3>

            <div className="text-6xl font-bold text-emerald-500">
              72
            </div>

            <p className="mt-2 text-slate-500">
              Habitable con apoyos
            </p>

          </div>

          <div className="bg-white rounded-3xl border p-6">

            <h3 className="font-semibold mb-4">
              Índice de Fricción Pedagógica
            </h3>

            <div className="text-6xl font-bold text-orange-500">
              58
            </div>

            <p className="mt-2 text-slate-500">
              Fricción moderada
            </p>

          </div>

          <div className="bg-white rounded-3xl border p-6">

            <h3 className="font-semibold mb-4">
              Nodos Detectados
            </h3>

            <div className="text-6xl font-bold text-red-400">
              4
            </div>

            <p className="mt-2 text-slate-500">
              Requieren atención
            </p>

          </div>

        </div>

        {/* NEA */}

        <div className="bg-white rounded-3xl border p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Nodos de Exclusión Accestética Detectados
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
              <span>NEA-02 · Muro de Texto</span>
              <span className="text-red-500">Alto</span>
            </div>

            <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
              <span>NEA-04 · PDF Dependiente</span>
              <span className="text-red-500">Alto</span>
            </div>

            <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
              <span>NEA-03 · Consigna Fantasma</span>
              <span className="text-orange-500">Medio</span>
            </div>

            <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
              <span>NEA-09 · Ruta Temporal Difusa</span>
              <span className="text-orange-500">Medio</span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
```
