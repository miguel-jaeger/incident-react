export function Toast({
    toast
}) {
  return (
    <>
      {/* Floating Toast */}
      {toast.visible && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest shadow-xl max-w-md border border-surface-container transition-all">
          <div className={`p-2 rounded-lg flex items-center justify-center ${toast.isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            <span className="material-symbols-outlined text-xl">{toast.isSuccess ? 'check_circle' : 'error'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-sm text-on-surface font-bold">{toast.title}</span>
            <span className="font-body-sm text-xs text-on-surface-variant">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
