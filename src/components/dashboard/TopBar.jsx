export default function TopBar() {
  return (
    <header className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <div className="inline-flex items-center gap-2 rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-600 ring-1 ring-red-200">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-red-500 text-[10px] text-white">◫</span>
          incident-controller
        </div>

        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <span className="font-medium text-slate-700">Mesa Operativa Campus</span>
          <span className="text-slate-400">34998</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-500">api-incident.render.com</span>
        </div>

        <div className="ml-auto flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Telemetría en tiempo real
        </div>
      </div>
    </header>
  );
}
