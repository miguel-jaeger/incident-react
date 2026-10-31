import React, { useState } from 'react';

export default function ApiDocsModal({ isOpen, onClose, hostUrl = "https://api-incident.onrender.com" }) {
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'auth' | 'users' | 'schemas'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" id="apiDocsModal">
      <div className="relative w-full max-w-3xl max-h-[88vh] rounded-2xl bg-white p-6 shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C8102E] text-white">
              <span className="material-symbols-outlined text-xl">api</span>
            </div>
            <div>
              <h2 className="font-headline-md text-base font-bold text-slate-900">
                API de Gestión de Incidentes (OpenAPI 3.0.1)
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Host: {hostUrl} | Versión: 1.0.0 • Apache 2.0
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer" 
            id="btnCloseDocs"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Tag Navigation Tabs */}
        <div className="flex items-center gap-1 pt-3 pb-2 border-b border-slate-100 shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'incidents'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">confirmation_number</span>
            <span>Incidentes & Métricas (10)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('auth')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'auth'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">vpn_key</span>
            <span>Autenticación (3)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">group</span>
            <span>Usuarios (5)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schemas')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'schemas'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">data_object</span>
            <span>Esquemas JSON (4)</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 font-sans pr-1 text-xs">
          {activeTab === 'incidents' && (
            <>
              {/* GET /api/incidents */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-600 text-white">GET</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/incidents</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK Array&lt;Incident&gt;</span>
                </div>
                <p className="text-xs text-slate-600">Obtiene el listado completo de incidencias reportadas en sedes UTP.</p>
              </div>

              {/* POST /api/incidents */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-600 text-white">POST</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/incidents</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">201 Created</span>
                </div>
                <p className="text-xs text-slate-600">Crea un nuevo ticket asignando título, descripción, prioridad y estado inicial. Requiere cabecera <code className="text-red-700 font-mono">Authorization: Bearer &lt;token&gt;</code>.</p>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-md text-[11px] font-mono overflow-x-auto">{`{
  "title": "Falla Switch Core Pabellón C",
  "description": "Pérdida de conectividad intermitente",
  "priority": "High",
  "status": "Active",
  "location": "Campus UTP - Pabellón C"
}`}</pre>
              </div>

              {/* PATCH /api/incidents/{id}/status */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500 text-white">PATCH</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/incidents/{`{id}`}/status</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK</span>
                </div>
                <p className="text-xs text-slate-600">Actualiza el estado (Active / Inactive) e incluye motivo de resolución o rechazo. Solo rol ADMIN.</p>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-md text-[11px] font-mono overflow-x-auto">{`{
  "status": "Inactive",
  "message": "Resuelto tras reinicio de switch POE"
}`}</pre>
              </div>

              {/* PATCH /api/incidents/{id}/priority */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500 text-white">PATCH</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/incidents/{`{id}`}/priority</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK</span>
                </div>
                <p className="text-xs text-slate-600">Actualiza el nivel de prioridad (High, Medium, Low). Solo rol ADMIN.</p>
              </div>

              {/* GET /api/incidents/{id} */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-600 text-white">GET</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/incidents/{`{id}`}</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK Incident</span>
                </div>
                <p className="text-xs text-slate-600">Obtiene el objeto detallado del incidente por su identificador numérico.</p>
              </div>

              {/* DELETE /api/incidents/{id} */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-600 text-white">DELETE</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/incidents/{`{id}`}</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">204 No Content</span>
                </div>
                <p className="text-xs text-slate-600">Elimina permanentemente el registro del servidor central.</p>
              </div>

              {/* Stats endpoints */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-600 text-white">GET</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/incidents/stats*</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK</span>
                </div>
                <p className="text-xs text-slate-600">Métricas y telemetría:</p>
                <ul className="list-disc list-inside font-mono text-[11px] text-slate-700 space-y-0.5">
                  <li>/api/incidents/stats (resumen general)</li>
                  <li>/api/incidents/stats/total ({`{"total": N}`})</li>
                  <li>/api/incidents/stats/by-status ({`{"Active": X, "Inactive": Y}`})</li>
                  <li>/api/incidents/stats/by-severity ({`{"High": A, "Medium": B, "Low": C}`})</li>
                  <li>/api/incidents/stats/by-category (desglose por categoría)</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'auth' && (
            <>
              {/* POST /api/auth/login */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-600 text-white">POST</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/auth/login</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK LoginResponse</span>
                </div>
                <p className="text-xs text-slate-600">Autentica por usuario o correo y devuelve un token de sesión portador.</p>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-md text-[11px] font-mono overflow-x-auto">{`{
  "username": "admin",
  "password": "admin123"
}`}</pre>
              </div>

              {/* GET /api/auth/me */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-600 text-white">GET</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/auth/me</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK</span>
                </div>
                <p className="text-xs text-slate-600">Devuelve el usuario, nombre y rol asociado al token actual.</p>
              </div>

              {/* POST /api/auth/logout */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-600 text-white">POST</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/auth/logout</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK</span>
                </div>
                <p className="text-xs text-slate-600">Invalida el token de sesión en el servidor.</p>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              {/* GET /api/users */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-600 text-white">GET</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/users</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK Array&lt;User&gt;</span>
                </div>
                <p className="text-xs text-slate-600">Listado completo de cuentas del sistema. Solo ADMIN.</p>
              </div>

              {/* POST /api/users */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-600 text-white">POST</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/users</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">201 Created</span>
                </div>
                <p className="text-xs text-slate-600">Registro de usuario. Registro público crea rol OPERATOR; ADMIN puede asignar ADMIN, SUPERVISOR, OPERATOR o SUPPORT.</p>
              </div>

              {/* PATCH /api/users/{id}/role */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500 text-white">PATCH</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/users/{`{id}`}/role</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK</span>
                </div>
                <p className="text-xs text-slate-600">Cambio de rol (ADMIN, SUPERVISOR, OPERATOR, SUPPORT). Solo ADMIN.</p>
              </div>

              {/* PATCH /api/users/{id}/password */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500 text-white">PATCH</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/users/{`{id}`}/password</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">200 OK</span>
                </div>
                <p className="text-xs text-slate-600">El propio usuario debe enviar currentPassword + newPassword. Un ADMIN puede restablecer cualquier contraseña enviando solo newPassword.</p>
              </div>

              {/* DELETE /api/users/{id} */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-600 text-white">DELETE</span>
                    <code className="font-mono text-xs text-slate-800 font-semibold">/api/users/{`{id}`}</code>
                  </div>
                  <span className="text-xs font-mono text-emerald-600 font-medium">204 No Content</span>
                </div>
                <p className="text-xs text-slate-600">Elimina el usuario. Solo ADMIN.</p>
              </div>
            </>
          )}

          {activeTab === 'schemas' && (
            <>
              {/* Incident Schema */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <span className="font-mono font-bold text-red-700">Schema: Incident</span>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-md text-[11px] font-mono overflow-x-auto">{`{
  "id": "integer (int64)",
  "title": "string",
  "description": "string",
  "message": "string (rejectionReason / notes)",
  "status": "string (Active | Inactive)",
  "severity": "string (High | Medium | Low)",
  "priority": "string (High | Medium | Low)",
  "category": "string (Redes | Hardware | Software | ...)",
  "location": "string",
  "ticketCode": "string (INC-1000+id)",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}`}</pre>
              </div>

              {/* RegisterUserRequest Schema */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <span className="font-mono font-bold text-red-700">Schema: RegisterUserRequest</span>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-md text-[11px] font-mono overflow-x-auto">{`{
  "username": "string",
  "name": "string",
  "fullName": "string",
  "email": "string",
  "password": "string",
  "role": "string (ADMIN | SUPERVISOR | OPERATOR | SUPPORT)"
}`}</pre>
              </div>

              {/* LoginRequest & LoginResponse */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 flex flex-col gap-1.5">
                <span className="font-mono font-bold text-red-700">Schema: LoginRequest / LoginResponse</span>
                <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-md text-[11px] font-mono overflow-x-auto">{`// Request
{
  "username": "admin",
  "password": "password123"
}

// Response
{
  "authenticated": true,
  "token": "utp-token-xxx",
  "username": "admin",
  "name": "Admin TI UTP",
  "email": "admin@utp.edu.pe",
  "role": "ADMIN"
}`}</pre>
              </div>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition" 
            id="btnDismissDocs"
          >
            Cerrar Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
