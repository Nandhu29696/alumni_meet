export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }) {
  if (!open) return null;

  return <div className="confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
    <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <h3 id="confirm-title">{title}</h3>
      <p>{message}</p>
      <div className="confirm-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>{cancelLabel}</button>
        <button type="button" className={danger ? 'primary-button danger-confirm' : 'primary-button'} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>;
}
