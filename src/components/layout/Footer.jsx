export function Footer({
    currentHost,
    isOnline
}) {
  return (
    <>
      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3 text-center md:text-left">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg" alt="UTP Logo" className="h-6 w-auto object-contain" />
            <span>© 2026 Universidad Tecnológica del Perú. Plataforma de Infraestructura & NOC Incidentes TI. <span className="font-mono font-semibold text-slate-400">[Variante 34998]</span></span>
          </div>
          <div className="flex items-center gap-4 font-medium text-slate-600">
            <span>Mesa de Ayuda UTP</span>
            <span>Soporte de Red</span>
            <span className={`font-mono font-semibold ${isOnline ? 'text-emerald-600' : 'text-red-600'}`}>
              {isOnline ? `En línea: ${currentHost.replace(/^https?:\/\//, '')}` : 'Desconectado'}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
