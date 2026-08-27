export default function ToastStack({ toasts, onDismiss }) {
  return <div className="toast-stack" role="status" aria-live="polite" aria-atomic="false">
    {toasts.map((toast) => <div key={toast.id} className={`toast-item ${toast.type || 'info'}`}>
      <p>{toast.message}</p>
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">×</button>
    </div>)}
  </div>;
}
