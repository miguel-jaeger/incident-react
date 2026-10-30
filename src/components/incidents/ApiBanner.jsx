export function ApiBanner({
    apiStatus,
    loadData
}) {
  return (
    <>
      {apiStatus.status !== 'online' && (
          <div className={`mb-4 rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm ${
            apiStatus.status === 'offline'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`p-2 rounded-lg flex items-center justify-center ${
              apiStatus.status === 'offline' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <span className="material-symbols-outlined text-xl">
                {apiStatus.status === 'offline' ? 'cloud_off' : 'hourglass_top'}
              </span>
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${apiStatus.status === 'offline' ? 'text-red-800' : 'text-amber-800'}`}>
                {apiStatus.status === 'offline'
                  ? 'Sin conexión con el backend'
                  : apiStatus.status === 'waking'
                    ? 'Despertando el servidor de Render'
                    : 'Conectando con el servidor'}
              </p>
              <p className={`text-xs mt-0.5 ${apiStatus.status === 'offline' ? 'text-red-700' : 'text-amber-700'}`}>
                {apiStatus.message || (apiStatus.status === 'offline'
                  ? 'Verifica que el backend esté activo o vuelve a intentarlo.'
                  : 'El plan gratuito de Render suspende el backend tras un periodo de inactividad.')}
              </p>
            </div>
            <button
              type="button"
              onClick={loadData}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                apiStatus.status === 'offline'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Reintentar
            </button>
          </div>
        )}
    </>
  );
}
