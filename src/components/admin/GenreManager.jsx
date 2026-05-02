import { useState, useMemo, useRef } from 'react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import { showToast } from './Toast';

// ═══════════════════════════════════════════
//  SAMPLE DATA — Ganti dengan data dari API
// ═══════════════════════════════════════════
const initialGenres = [
  { id: 1, name: 'Fantasy', description: 'Cerita imajinatif dengan elemen magis dan dunia fiksi yang memukau', bookCount: 24 },
  { id: 2, name: 'Science Fiction', description: 'Fiksi ilmiah berbasis teknologi mutakhir dan masa depan', bookCount: 18 },
  { id: 3, name: 'Romance', description: 'Cerita cinta dan hubungan emosional antar karakter utama', bookCount: 31 },
  { id: 4, name: 'Thriller', description: 'Cerita menegangkan dengan plot twist yang tak terduga', bookCount: 15 },
  { id: 5, name: 'Mystery', description: 'Cerita detektif dan pemecahan kasus misterius yang rumit', bookCount: 12 },
  { id: 6, name: 'Horror', description: 'Cerita seram bertema supernatural yang menimbulkan rasa takut', bookCount: 9 },
  { id: 7, name: 'Historical Fiction', description: 'Fiksi berlatar belakang sejarah dengan akurasi periode tinggi', bookCount: 7 },
  { id: 8, name: 'Biography', description: 'Kisah hidup nyata tokoh terkenal dunia yang inspiratif', bookCount: 5 },
];

const EMPTY_FORM = { name: '', description: '' };

export default function GenreManager() {
  const [genres, setGenres] = useState(initialGenres);
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState({ open: false, mode: null, genre: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, genre: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [newRowId, setNewRowId] = useState(null);
  const nameRef = useRef(null);

  // ─── FILTERED ───
  const filtered = useMemo(() => {
    if (!search.trim()) return genres;
    const q = search.toLowerCase();
    return genres.filter(
      (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
    );
  }, [genres, search]);

  const totalBooks = useMemo(() => genres.reduce((s, g) => s + g.bookCount, 0), [genres]);

  // ─── VALIDATE ───
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama genre wajib diisi';
    else if (form.name.trim().length < 2) errs.name = 'Minimal 2 karakter';
    else if (form.name.trim().length > 50) errs.name = 'Maksimal 50 karakter';

    if (!form.description.trim()) errs.description = 'Deskripsi wajib diisi';
    else if (form.description.trim().length < 10) errs.description = 'Minimal 10 karakter';
    else if (form.description.trim().length > 200) errs.description = 'Maksimal 200 karakter';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── OPEN CREATE ───
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setFormModal({ open: true, mode: 'create', genre: null });
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  // ─── OPEN EDIT ───
  const openEdit = (genre) => {
    setForm({ name: genre.name, description: genre.description });
    setErrors({});
    setFormModal({ open: true, mode: 'edit', genre });
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  // ─── SUBMIT CREATE ───
  const handleCreate = () => {
    if (!validate()) return;

    const newId = Math.max(0, ...genres.map((g) => g.id)) + 1;
    const newGenre = {
      id: newId,
      name: form.name.trim(),
      description: form.description.trim(),
      bookCount: 0,
    };
    setGenres((prev) => [newGenre, ...prev]);
    setNewRowId(newId);
    setTimeout(() => setNewRowId(null), 600);

    setFormModal({ open: false, mode: null, genre: null });
    showToast({
      type: 'success',
      title: 'Genre Baru Ditambahkan',
      desc: `"${newGenre.name}" berhasil ditambahkan ke sistem.`,
    });
  };

  // ─── SUBMIT UPDATE ───
  const handleUpdate = () => {
    if (!validate()) return;

    setGenres((prev) =>
      prev.map((g) =>
        g.id === formModal.genre.id
          ? { ...g, name: form.name.trim(), description: form.description.trim() }
          : g
      )
    );
    setFormModal({ open: false, mode: null, genre: null });
    showToast({
      type: 'success',
      title: 'Genre Diperbarui',
      desc: `"${form.name.trim()}" berhasil diperbarui.`,
    });
  };

  // ─── DELETE ───
  const openDelete = (genre) => setDeleteDialog({ open: true, genre });

  const handleDelete = () => {
    const name = deleteDialog.genre.name;
    const count = deleteDialog.genre.bookCount;
    setGenres((prev) => prev.filter((g) => g.id !== deleteDialog.genre.id));
    setDeleteDialog({ open: false, genre: null });
    showToast({
      type: 'error',
      title: 'Genre Dihapus',
      desc: `"${name}" telah dihapus dari sistem.`,
    });
  };

  const closeModal = () => setFormModal({ open: false, mode: null, genre: null });

  const handleFormSubmit = () => {
    if (formModal.mode === 'create') handleCreate();
    else handleUpdate();
  };

  return (
    <div className="crud-container">
      {/* ═══ HEADER ═══ */}
      <div className="crud-header">
        <div className="crud-title-group">
          <h2 className="crud-title">
            <span className="icon-badge">📚</span>
            Manajemen Genre
          </h2>
          <p className="crud-subtitle">Kelola data genre buku yang tersedia di katalog</p>
        </div>
        <div className="crud-header-right">
          <div className="crud-stats">
            <div className="stat-chip">Genre: <span>{genres.length}</span></div>
            <div className="stat-chip">Total Buku: <span>{totalBooks}</span></div>
          </div>
        </div>
      </div>

      {/* ═══ TOOLBAR ═══ */}
      <div className="crud-toolbar">
        <div className="crud-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari genre berdasarkan nama atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-add" onClick={openCreate}>
          <span className="plus-icon">+</span>
          Tambah Genre
        </button>
      </div>

      {/* ═══ TABLE ═══ */}
      <div className="crud-table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <p className="empty-title">
              {search ? 'Tidak ada hasil ditemukan' : 'Belum ada genre'}
            </p>
            <p className="empty-desc">
              {search
                ? 'Coba kata kunci lain atau hapus filter pencarian'
                : 'Klik tombol "Tambah Genre" untuk menambahkan data baru'}
            </p>
          </div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>ID</th>
                <th>Nama Genre</th>
                <th>Deskripsi</th>
                <th style={{ width: '90px' }}>Buku</th>
                <th style={{ width: '150px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((genre) => (
                <tr key={genre.id} className={newRowId === genre.id ? 'row-new' : ''}>
                  <td><span className="col-id">#{String(genre.id).padStart(3, '0')}</span></td>
                  <td><span className="col-name">{genre.name}</span></td>
                  <td><span className="col-desc" title={genre.description}>{genre.description}</span></td>
                  <td><span className="col-count">📖 {genre.bookCount}</span></td>
                  <td>
                    <div className="col-actions">
                      <button className="btn btn-edit" onClick={() => openEdit(genre)}>✏️ Edit</button>
                      <button className="btn btn-delete" onClick={() => openDelete(genre)}>🗑️ Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length > 0 && (
          <div className="table-footer">
            <span>Menampilkan {filtered.length} dari {genres.length} genre</span>
            <span>{search && 'Filter aktif — '}<span style={{ color: 'var(--admin-accent)' }}>{totalBooks} buku terkait</span></span>
          </div>
        )}
      </div>

      {/* ═══ CREATE / EDIT MODAL ═══ */}
      <Modal
        isOpen={formModal.open}
        onClose={closeModal}
        title={formModal.mode === 'create' ? 'Tambah Genre Baru' : 'Edit Genre'}
        mode={formModal.mode}
        footer={
          <>
            <button className="btn btn-cancel" onClick={closeModal}>Batal</button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {formModal.mode === 'create' ? '✚ Tambah Genre' : '💾 Simpan Perubahan'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">
            Nama Genre <span className="required">*</span>
          </label>
          <input
            ref={nameRef}
            className={`form-input ${errors.name ? 'error' : ''}`}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Contoh: Fantasy, Thriller, Romance..."
            maxLength={50}
            onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
          />
          {errors.name ? (
            <p className="form-error">⚠ {errors.name}</p>
          ) : (
            <p className="form-hint">{form.name.length}/50 karakter</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            Deskripsi <span className="required">*</span>
          </label>
          <textarea
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Jelaskan secara singkat tentang genre ini..."
            rows={3}
            maxLength={200}
          />
          {errors.description ? (
            <p className="form-error">⚠ {errors.description}</p>
          ) : (
            <p className="form-hint">{form.description.length}/200 karakter</p>
          )}
        </div>

        {formModal.mode === 'edit' && (
          <div className="form-info-box">
            <p>
              ℹ️ Perubahan akan mempengaruhi <strong>{formModal.genre?.bookCount} buku</strong> yang
              terkait dengan genre &quot;{formModal.genre?.name}&quot;.
            </p>
          </div>
        )}
      </Modal>

      {/* ═══ DELETE CONFIRM ═══ */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, genre: null })}
        onConfirm={handleDelete}
        itemName={deleteDialog.genre?.name}
        extraInfo={
          deleteDialog.genre?.bookCount > 0
            ? `Genre ini memiliki ${deleteDialog.genre.bookCount} buku yang terkait.`
            : null
        }
      />
    </div>
  );
}