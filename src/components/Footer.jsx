import React from 'react';

const UTP_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/5/50/Utplogonuevo.svg";

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 py-6">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="h-7 w-auto flex items-center">
            <img 
              src={UTP_LOGO_URL} 
              alt="UTP" 
              className="h-6 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/favicon.svg";
              }}
            />
          </div>
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
          <div className="text-xs text-slate-500">
            <span>© 2025 Universidad Tecnológica del Perú. Plataforma de Infraestructura &amp; NOC Incidentes TI.</span>
            <span className="ml-2 font-mono text-slate-400 font-semibold">[Variante 34998]</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-600">
          <a className="hover:text-red-700 transition" href="#help">Mesa de Ayuda UTP</a>
          <a className="hover:text-red-700 transition" href="#network">Soporte de Red</a>
          <a className="hover:text-red-700 transition" href="#servers">Estado de Servidores</a>
        </div>
      </div>
    </footer>
  );
}

