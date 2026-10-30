const statusStyles = {
  Active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Inactive: 'bg-slate-200 text-slate-600 ring-slate-200',
};

const priorityStyles = {
  High: 'bg-red-500 text-white',
  Medium: 'bg-orange-400 text-white',
  Low: 'bg-sky-500 text-white',
};

export default function IncidentTable({ incidents }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-separate border-spacing-0 text-left">
          <thead className="bg-slate-100 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:text-[11px]">
            <tr>
              <th className="px-3 py-3 sm:px-4">Ticket</th>
              <th className="px-3 py-3 sm:px-4">Incidente / descripción</th>
              <th className="px-3 py-3 sm:px-4">Campus</th>
              <th className="px-3 py-3 sm:px-4">Estado</th>
              <th className="px-3 py-3 sm:px-4">Prioridad</th>
              <th className="px-3 py-3 sm:px-4">Registro</th>
              <th className="px-3 py-3 text-right sm:px-4">Comandos</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {incidents.map((item) => (
              <tr key={item.id} className="align-middle transition hover:bg-slate-50">
                <td className="px-3 py-4 text-sm font-bold text-slate-700 sm:px-4">{item.id}</td>

                <td className="px-3 py-4 sm:px-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-slate-800 sm:text-[15px]">{item.title}</h3>
                    <p className="max-w-md text-xs text-slate-500 sm:text-sm">{item.description}</p>
                  </div>
                </td>

                <td className="px-3 py-4 text-xs text-slate-600 sm:px-4 sm:text-sm">
                  {item.campus}
                </td>

                <td className="px-3 py-4 sm:px-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 sm:text-[11px] ${statusStyles[item.status]}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                    {item.status}
                  </span>
                </td>

                <td className="px-3 py-4 sm:px-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-[11px] ${priorityStyles[item.priority]}`}>
                    {item.priority}
                  </span>
                </td>

                <td className="px-3 py-4 text-xs text-slate-500 sm:px-4 sm:text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{item.registered}</span>
                    <span className="text-[10px] text-slate-400 sm:text-[11px]">{item.time}</span>
                  </div>
                </td>

                <td className="px-3 py-4 sm:px-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-slate-100 sm:text-xs">
                      Detalle
                    </button>
                    <button type="button" className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 hover:bg-slate-100 sm:text-xs">
                      Estado
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
