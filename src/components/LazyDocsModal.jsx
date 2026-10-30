import React from 'react';
export default function LazyDocsModal({auth, base, incidents, local, me, setShowDocsModal, showDocsModal, stats, total, users}) { return <>
      {/* Modal: Docs */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-surface-container-lowest p-6 shadow-2xl flex flex-col border border-surface-container overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary text-white">
                  <span className="material-symbols-outlined text-xl">api</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-base text-on-surface font-bold">Documentación de la API</h2>
                  <p className="text-xs text-on-surface-variant">Referencia de servicios disponibles</p>
                </div>
              </div>
              <button onClick={() => setShowDocsModal(false)} className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 overflow-y-auto max-h-[60vh] pr-1">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-primary text-white">POST</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/auth/login</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Autenticación de operadores y administradores TI (Token / Sesión).</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-emerald-600 text-white">POST</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/users</code>
                  <span className="text-xs text-emerald-600 font-semibold">201 Created</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Registro de usuarios (usuario, nombre, correo y contraseña). Se crean con rol Operador.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/users</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Listado de usuarios para el panel de administración (requiere token ADMIN).</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/users/{'{id}'}</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Detalle de un usuario por su identificador.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500 text-white">PATCH</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/users/{'{id}'}/role</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Actualización del rol de un usuario (Administrador, Supervisor, Operador o Soporte).</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500 text-white">PATCH</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/users/{'{id}'}/password</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Cambio de contraseña. El propio usuario envía actual + nueva; un administrador puede cambiarla sin la actual.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-red-600 text-white">DELETE</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/users/{'{id}'}</code>
                  <span className="text-xs text-emerald-600 font-semibold">204 No Content</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Elimina una cuenta de usuario (solo administrador; no permite eliminar la propia).</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/auth/me</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Valida el token activo y devuelve el usuario autenticado.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-emerald-600 text-white">POST</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/auth/logout</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Invalida la sesión del usuario y limpia el token local.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Listado completo de incidentes registrados en la base de datos.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/{'{id}'}</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Detalle de un incidente por su identificador.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/stats</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Métricas globales: total, activos, inactivos, severidad y categorías.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/stats/total</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Total de incidentes registrados.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/stats/by-status</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Conteo de incidentes agrupado por estado.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/stats/by-severity</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Conteo de incidentes agrupado por severidad.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/stats/by-category</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Total de incidencias agrupadas por categoría (Redes, Hardware, etc.).</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-emerald-600 text-white">POST</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Creación de ticket con título, descripción, severidad, categoría y ubicación.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500 text-white">PATCH</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/{'{id}'}/status</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Actualiza el estado (Activo / Inactivo) y las notas de rechazo o resolución.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-amber-500 text-white">PATCH</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/{'{id}'}/priority</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Actualiza la prioridad del incidente (Alta / Media / Baja). Solo administrador.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-red-600 text-white">DELETE</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/{'{id}'}</code>
                  <span className="text-xs text-emerald-600 font-semibold">204 No Content</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Elimina permanentemente un incidente en la base de datos.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-sky-600 text-white">GET</span>
                  <code className="font-mono text-xs font-bold text-on-surface">/api/incidents/stats/count</code>
                  <span className="text-xs text-emerald-600 font-semibold">200 OK</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Cantidad total de incidentes (alias de stats/total).</p>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-container flex justify-end">
              <button onClick={() => setShowDocsModal(false)} className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold">Entendido</button>
            </div>
          </div>
        </div>
      )}


</>; }
