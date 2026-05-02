import { useState, useMemo } from 'react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import { showToast } from './Toast';

// ============ SAMPLE DATA ============
// Ganti ini dengan data dari API/props project kamu
const initialAuthors = [
  { id: 1, name: 'Tere Liye', country: 'Indonesia', bio: 'Penulis novel populer Indonesia dengan puluhan karya bestseller', bookCount: 28, status: 'Active' },
  { id: 2, name: 'Andrea Hirata', country: 'Indonesia', bio: 'Penulis novel Laskar Pelangi yang mendunia', bookCount: 12, status: 'Active' },
  { id: 3, name: 'J.K. Rowling', country: 'Inggris', bio: 'Pencipta dunia Harry Potter yang fenomenal', bookCount: 15, status: 'Active' },
  { id: 4, name: 'Haruki Murakami', country: 'Jepang', bio: 'Penulis surrealisme terkenal asal Jepang', bookCount: 22, status: 'Active' },
  { id: 5, name: 'Stephen King', country: 'Amerika', bio: 'Raja horor dan thriller dengan ratusan karya', bookCount: 64, status: 'Active' },
  { id: 6, name: 'Pramoedya Ananta Toer', country: 'Indonesia', bio: 'Sastrawan besar Indonesia, penulis Tetralogi Buru', bookCount: 18, status: 'Inactive' },
  { id: 7, name: 'Agatha Christie', country: 'Inggris', bio: 'Ratu novel detektif dengan karya ikonik Hercule Poirot', bookCount: 73, status: 'Inactive' },
  { id: 8, name: 'Dee Lestari', country: 'Indonesia', bio: 'Penulis dan musisi, terkenal dengan novel Supernova', bookCount: 9, status: 'Active' },
];

export default function AuthorManager() {
  const [authors, setAuthors] = useState(initialAuthors);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState({ open: false, author: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, author: null });
  const [form, setForm] = useState({ name: '', country: '', bio: '', status: 'Active' });
  const [errors, setErrors] = useState({});

  // ===== FILTERED DATA =====
  const filtered = useMemo(() => {
    if (!search.trim()) return authors;
    const q = search.toLowerCase();
    return authors.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.bio.toLowerCase().includes(q)
    );
  }, [authors, search]);

  // ===== VALIDATE FORM =====
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama penulis wajib diisi';
    else if (form.name.trim().length < 2) errs.name = 'Nama minimal 2 karakter';
    if (!form.country.trim()) errs.country = 'Negara wajib diisi';
    if (!form.bio.trim()) errs.bio = 'Bio wajib diisi';
    else if (form.bio.trim().length < 10) errs.bio = 'Bio minimal 10 karakter';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== OPEN EDIT MODAL =====
  const openEdit = (author) => {
    setForm({
      name: author.name,
      country: author.country,
      bio: author.bio,
      status: author.status,
    });
    setErrors({});
    setEditModal({ open: true, author });
  };

  // ===== SUBMIT UPDATE =====
  const handleUpdate = () => {
    if (!validate()) return;

    setAuthors((prev) =>
      prev.map((a) =>
        a.id === editModal.author.id
          ? {
              ...a,
              name: form.name.trim(),
              country: form.country.trim(),
              bio: form.bio.trim(),
              status: form.status,
            }
          : a
      )
    );
    setEditModal({ open: false, author: null });
    showToast({
      type: 'success',
      title: 'Penulis Diperbarui',
      desc: `Data "${form.name.trim()}" berhasil disimpan.`,
    });
  };

  // ===== OPEN DELETE DIALOG =====
  const openDelete = (author) => {
    setDeleteDialog({ open: true, author });
  };

  // ===== CONFIRM DELETE =====
  const handleDelete = () => {
    const name = deleteDialog.author.name;
    setAuthors((prev) => prev.filter((a) => a.id !== deleteDialog.author.id));
    setDeleteDialog({ open: false, author: null });
    showToast({
      type: 'error',
      title: 'Penulis Dihapus',
      desc: `"${name}" telah dihapus dari sistem.`,
    });
  };

  // ===== STATUS BADGE =====
  const StatusBadge = ({ status }) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 12px',
        borderRadius: '100px',
        fontSize: '0.75rem',
        fontWeight: 700,
        background:
          status === 'Active'
            ? 'var(--admin-success-glow)'
            : 'rgba(139, 143, 163, 0.1)',
        color: status === 'Active' ? 'var(--admin-success)' : 'var(--admin-text-muted)',
        border: `1px solid ${status === 'Active' ? 'rgba(34,197,94,0.2)' : 'var(--admin-border)'}`,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: status === 'Active' ? 'var(--admin-success)' : 'var(--admin-text-muted)',
        }}
      />
      {status === 'Active' ? 'Aktif' : 'Nonaktif'}
    </span>
  );

  return (
    <div className="crud-container">
      {/* HEADER */}
      <div className="crud-header">
        <h2 className="crud-title">
          <span className="icon-badge">✍️</span>
          Manajemen Penulis
        </h2>
        <div className="crud-stats">
          <div className="stat-chip">
            Total: <span>{authors.length}</span>
          </div>
          <div className="stat-chip">
            Aktif: <span>{authors.filter((a) => a.status === 'Active').length}</span>
          </div>
          <div className="stat-chip">
            Ditampilkan: <span>{filtered.length}</span>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="crud-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Cari penulis berdasarkan nama, negara, atau bio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="crud-table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p>Tidak ada penulis yang ditemukan</p>
          </div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>ID</th>
                <th>Nama Penulis</th>
                <th>Negara</th>
                <th>Bio</th>
                <th style={{ width: '90px' }}>Buku</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '160px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((author) => (
                <tr key={author.id}>
                  <td><span className="col-id">#{String(author.id).padStart(3, '0')}</span></td>
                  <td><span className="col-name">{author.name}</span></td>
                  <td>{author.country}</td>
                  <td><span className="col-desc" title={author.bio}>{author.bio}</span></td>
                  <td><span className="col-count">📖 {author.bookCount}</span></td>
                  <td><StatusBadge status={author.status} /></td>
                  <td>
                    <div className="col-actions">
                      <button className="btn btn-edit" onClick={() => openEdit(author)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-delete" onClick={() => openDelete(author)}>
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, author: null })}
        title="Edit Penulis"
        icon="✏️"
        footer={
          <>
            <button
              className="btn btn-cancel"
              onClick={() => setEditModal({ open: false, author: null })}
            >
              Batal
            </button>
            <button className="btn btn-primary" onClick={handleUpdate}>
              💾 Simpan Perubahan
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Nama Penulis</label>
          <input
            className="form-input"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Masukkan nama penulis..."
          />
          {errors.name && <p style={{ color: 'var(--admin-danger)', fontSize: '0.78rem', marginTop: '6px' }}>{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Negara</label>
          <input
            className="form-input"
            type="text"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="Masukkan negara asal..."
          />
          {errors.country && <p style={{ color: 'var(--admin-danger)', fontSize: '0.78rem', marginTop: '6px' }}>{errors.country}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Bio / Deskripsi Singkat</label>
          <textarea
            className="form-textarea"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Masukkan bio penulis..."
            rows={3}
          />
          {errors.bio && <p style={{ color: 'var(--admin-danger)', fontSize: '0.78rem', marginTop: '6px' }}>{errors.bio}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Active', 'Inactive'].map((s) => (
              <label
                key={s}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background:
                    form.status === s
                      ? s === 'Active'
                        ? 'var(--admin-success-glow)'
                        : 'rgba(139,143,163,0.1)'
                      : 'var(--admin-bg)',
                  border: `1px solid ${
                    form.status === s
                      ? s === 'Active'
                        ? 'rgba(34,197,94,0.3)'
                        : 'var(--admin-border)'
                      : 'var(--admin-border)'
                  }`,
                  color: form.status === s ? (s === 'Active' ? 'var(--admin-success)' : 'var(--admin-text)') : 'var(--admin-text-muted)',
                  fontWeight: form.status === s ? '600' : '400',
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={() => setForm({ ...form, status: s })}
                  style={{ display: 'none' }}
                />
                {s === 'Active' ? '🟢 Aktif' : '⚪ Nonaktif'}
              </label>
            ))}
          </div>
        </div>

        <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.06)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.12)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            ℹ️ Penulis ini memiliki <strong style={{ color: '#60a5fa' }}>{editModal.author?.bookCount} buku</strong> yang terdaftar di sistem.
          </p>
        </div>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, author: null })}
        onConfirm={handleDelete}
        itemName={deleteDialog.author?.name}
      />
    </div>
  );
}