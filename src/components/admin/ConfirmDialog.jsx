import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, itemName, extraInfo }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus" footer={null}>
      <div className="confirm-body">
        <div className="confirm-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="confirm-text">
          Apakah kamu yakin ingin menghapus <strong>"{itemName}"</strong>?
        </p>
        {extraInfo && <p className="confirm-subtext">{extraInfo}</p>}
        <p className="confirm-subtext" style={{ marginTop: '4px' }}>
          Data yang sudah dihapus tidak dapat dikembalikan.
        </p>
        <div className="confirm-actions">
          <button className="btn btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button className="btn btn-confirm-delete" onClick={onConfirm}>
            Ya, Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}