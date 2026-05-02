import { useState, useMemo } from 'react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import { showToast } from './Toast';

// ============ SAMPLE DATA ============
// Ganti ini dengan data dari API/props project kamu
const initialGenres = [
  { id: 1, name: 'Fantasy', description: 'Cerita imajinatif dengan elemen magis dan dunia fiksi', bookCount: 24 },
  { id: 2, name: 'Science Fiction', description: 'Fiksi ilmiah berbasis teknologi dan masa depan', bookCount: 18 },
  { id: 3, name: 'Romance', description: 'Cerita cinta dan hubungan antar karakter', bookCount: 31 },
  { id: 4, name: 'Thriller', description: 'Cerita menegangkan dengan plot twist mengejutkan', bookCount: 15 },
  { id: 5, name: 'Mystery', description: 'Cerita detektif dan pemecahan kasus misterius', bookCount: 12 },
  { id: 6, name: 'Horror', description: 'Cerita seram yang menimbulkan rasa takut', bookCount: 9 },
  { id: 7, name: 'Historical Fiction', description: 'Fiksi berlatar sejarah dengan akurasi periode', bookCount: 7 },
  { id: 8, name: 'Biography', description: 'Kisah hidup nyata tokoh terkenal', bookCount: 5 },
];

export default function GenreManager() {
  const [genres, setGenres] = useState(initialGenres);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState({ open: false, genre: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, genre: null });
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  // ===== FILTERED DATA =====
  const filtered = useMemo(() => {
    if (!search.trim()) return genres;
    const q = search.toLowerCase();
    return genres.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    );
  }, [genres, search]);

  // ===== VALIDATE FORM =====
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama genre wajib diisi';
    else if (form.name.trim().length < 2) errs.name = 'Nama minimal 2 karakter';
    else if (form.name.trim().length > 50) errs.name = 'Nama maksimal 50 karakter';
    if (!form.description.trim()) errs.description = 'Deskripsi wajib diisi';
    else if (form.description.trim().length < 10) errs.description = 'Deskripsi minimal 10 karakter';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== OPEN EDIT MODAL =====
  const openEdit = (genre) => {
    setForm({ name: genre.name, description: genre.description });
    setErrors({});
    setEditModal({ open: true, genre });
  };

  // ===== SUBMIT UPDATE =====
  const handleUpdate = () => {
    if (!validate()) return;

    setGenres((prev) =>
      prev.map((g) =>
        g.id === editModal.genre.id
          ? { ...g, name: form.name.trim(), description: form.description.trim() }
          : g
      )
    );
    setEditModal({ open: false, genre: null });
    showToast({
      type: 'success',
      title: 'Genre Diperbarui',
      desc: `"${form.name.trim()}" berhasil diperbarui.`,
    });
  };

  // ===== OPEN DELETE DIALOG =====
  const openDelete = (genre) => {
    setDeleteDialog({ open: true, genre });
  };

  // ===== CONFIRM DELETE =====
  const handleDelete = () => {
    const name = deleteDialog.genre.name;
    setGenres((prev) => prev.filter((g) => g.id !== deleteDialog.genre.id));
    setDeleteDialog({ open: false, genre: null });
    showToast({
      type: 'error',
      title: 'Genre Dihapus',
      desc: `"${name}" telah dihapus dari sistem.`,
    });
  };

  return (
    <div className="crud-container">
      {/* HEADER */}
      <div className="crud-header">
        <h2 className="crud-title">
          <span className="icon-badge">📚</span>
          Manajemen Genre
        </h2>
        <div className="crud-stats">
          <div className="stat-chip">
            Total: <span>{genres.length}</span>
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
          placeholder="Cari genre berdasarkan nama atau deskripsi..."
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
            <p>Tidak ada genre yang ditemukan</p>
          </div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>ID</th>
                <th>Nama Genre</th>
                <th>Deskripsi</th>
                <th style={{ width: '100px' }}>Buku</th>
                <th style={{ width: '160px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((genre, idx) => (
                <tr key={genre.id}>
                  <td><span className="col-id">#{String(genre.id).padStart(3, '0')}</span></td>
                  <td><span className="col-name">{genre.name}</span></td>
                  <td><span className="col-desc" title={genre.description}>{genre.description}</span></td>
                  <td><span className="col-count">📖 {genre.bookCount}</span></td>
                  <td>
                    <div className="col-actions">
                      <button className="btn btn-edit" onClick={() => openEdit(genre)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-delete" onClick={() => openDelete(genre)}>
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
        onClose={() => setEditModal({ open: false, genre: null })}
        title="Edit Genre"
        icon="✏️"
        footer={
          <>
            <button
              className="btn btn-cancel"
              onClick={() => setEditModal({ open: false, genre: null })}
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
          <label className="form-label">Nama Genre</label>
          <input
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Masukkan nama genre..."
            maxLength={50}
          />
          {errors.name && <p style={{ color: 'var(--admin-danger)', fontSize: '0.78rem', marginTop: '6px' }}>{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Deskripsi</label>
          <textarea
            className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Masukkan deskripsi genre..."
            rows={3}
          />
          {errors.description && <p style={{ color: 'var(--admin-danger)', fontSize: '0.78rem', marginTop: '6px' }}>{errors.description}</p>}
        </div>

        <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.06)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.12)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
            ℹ️ Mengubah nama genre akan mempengaruhi <strong style={{ color: '#60a5fa' }}>{editModal.genre?.bookCount} buku</strong> yang terkait dengan genre ini.
          </p>
        </div>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, genre: null })}
        onConfirm={handleDelete}
        itemName={deleteDialog.genre?.name}
      />
    </div>
  );
}