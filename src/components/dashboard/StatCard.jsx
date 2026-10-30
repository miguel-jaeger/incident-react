const toneClasses = {
  default: 'border-slate-200 bg-white text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
};

export default function StatCard({
  title,
  value,
  meta,
  accent,
  progress,
  label,
  tone = 'default',
}) {
  const cardClasses = toneClasses[tone] || toneClasses.default;

  return (
    <div className={`group relative flex h-full min-h-[170px] flex-col overflow-hidden rounded-xl border ${cardClasses} shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:text-[11px]">
          {title}
        </span>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-base sm:text-lg ${accent}`}>
          {meta.icon}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="flex flex-wrap items-end gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{value}</span>
          {label && <span className="mb-1 text-[10px] font-semibold text-slate-500 sm:text-[11px]">{label}</span>}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-slate-500 sm:text-[11px]">
          <span>{meta.text}</span>
          {meta.value && <span className="font-semibold text-slate-700">{meta.value}</span>}
        </div>

        {progress !== undefined && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
            <div
              className={`h-full rounded-full ${
                accent.includes('text-red')
                  ? 'bg-red-500'
                  : accent.includes('text-emerald')
                    ? 'bg-emerald-500'
                    : accent.includes('text-sky')
                      ? 'bg-sky-500'
                      : 'bg-slate-800'
              }`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-slate-300 to-slate-100" />
    </div>
  );
}
