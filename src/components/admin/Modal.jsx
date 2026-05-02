export default function Modal({ isOpen, onClose, title, mode, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {title}
            {mode && (
              <span className={`mode-tag ${mode}`}>
                {mode === 'create' ? '+ Baru' : '✎ Edit'}
              </span>
            )}
          </h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}