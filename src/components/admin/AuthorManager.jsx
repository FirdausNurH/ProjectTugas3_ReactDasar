import { useState, useMemo, useRef } from 'react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import { showToast } from './Toast';

// ═══════════════════════════════════════════
//  SAMPLE DATA — Ganti dengan data dari API
// ═══════════════════════════════════════════
const initialAuthors = [
  { id: 1, name: 'Tere Liye', country: 'Indonesia', bio: 'Penulis novel populer Indonesia dengan puluhan karya bestseller nasional', bookCount: 28, status: 'Active' },
  { id: 2, name: 'Andrea Hirata', country: 'Indonesia', bio: 'Penulis novel Laskar Pelangi yang mendunia dan fenomenal', bookCount: 12, status: 'Active' },
  { id: 3, name: 'J.K. Rowling', country: 'Inggris', bio: 'Pencipta dunia Harry Potter yang menjadi fenomena global', bookCount: 15, status: 'Active' },
  { id: 4, name: 'Haruki Murakami', country: 'Jepang', bio: 'Penulis surrealisme terkenal asal Jepang dengan gaya unik', bookCount: 22, status: 'Active' },
  { id: 5, name: 'Stephen King', country: 'Amerika', bio: 'Raja horor dan thriller dengan lebih dari 60 novel terbit', bookCount: 64, status: 'Active' },
  { id: 6, name: 'Pramoedya Ananta Toer', country: 'Indonesia', bio: 'Sastrawan besar Indonesia, pencipta Tetralogi Buru yang legendaris', bookCount: 18, status: 'Inactive' },
  { id: 7, name: 'Agatha Christie', country: 'Inggris', bio: 'Ratu novel detektif dengan karakter ikonik Hercule Poirot', bookCount: 73, status: 'Inactive' },
  { id: 8, name: 'Dee Lestari', country: 'Indonesia', bio: 'Penulis dan musisi multi-talenta, terkenal dengan seri Supernova', bookCount: 9, status: 'Active' },
];

const EMPTY_FORM = { name: '', country: '', bio: '', status: 'Active' };

const COUNTRY_OPTIONS = [
  'Indonesia', 'Inggris', 'Amerika', 'Jepang', 'Korea', 'Prancis',
  'Jerman', 'Italia', 'Spanyol', 'India', 'Australia', 'Lainnya',
];

export default function AuthorManager() {
  const [authors, setAuthors] = useState(initialAuthors);
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState({ open: false, mode: null, author: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, author: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [newRowId, setNewRowId] = useState(null);
  const nameRef = useRef(null);

  // ─── FILTERED ───
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

  const totalBooks = useMemo(() => authors.reduce((s, a) => s + a.bookCount, 0), [authors]);
  const activeCount = useMemo(() => authors.filter((a) => a.status === 'Active').length, [authors]);

  // ─── VALIDATE ───
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama penulis wajib diisi';
    else if (form.name.trim().length < 2) errs.name = 'Minimal 2 karakter';
    else if (form.name.trim().length > 80) errs.name = 'Maksimal 80 karakter';

    if (!form.country) errs.country = 'Negara wajib dipilih';

    if (!form.bio.trim()) errs.bio = 'Bio wajib diisi';
    else if (form.bio.trim().length < 10) errs.bio = 'Minimal 10 karakter';
    else if (form.bio.trim().length > 250) errs.bio = 'Maksimal 250 karakter';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── OPEN CREATE ───
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setFormModal({ open: true, mode: 'create', author: null });
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  // ─── OPEN EDIT ───
  const openEdit = (author) => {
    setForm({
      name: author.name,
      country: author.country,
      bio: author.bio,
      status: author.status,
    });
    setErrors({});
    setFormModal({ open: true, mode: 'edit', author });
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  // ─── SUBMIT CREATE ───
  const handleCreate = () => {
    if (!validate()) return;

    const newId = Math.max(0, ...authors.map((a) => a.id)) + 1;
    const newAuthor = {
      id: newId,
      name: form.name.trim(),
      country: form.country,
      bio: form.bio.trim(),
      bookCount: 0,
      status: form.status,
    };
    setAuthors((prev) => [newAuthor, ...prev]);
    setNewRowId(newId);
    setTimeout(() => setNewRowId(null), 600);

    setFormModal({ open: false, mode: null, author: null });
    showToast({
      type: 'success',
      title: 'Penulis Baru Ditambahkan',
      desc: `"${newAuthor.name}" berhasil didaftarkan ke sistem.`,
    });
  };

  // ─── SUBMIT UPDATE ───
  const handleUpdate = () => {
    if (!validate()) return;

    setAuthors((prev) =>
      prev.map((a) =>
        a.id === formModal.author.id
          ? {
              ...a,
              name: form.name.trim(),
              country: form.country,
              bio: form.bio.trim(),
              status: form.status,
            }
          : a
      )
    );
    setFormModal({ open: false, mode: null, author: null });
    showToast({
      type: 'success',
      title: 'Penulis Diperbarui',
      desc: `Data "${form.name.trim()}" berhasil disimpan.`,
    });
  };

  // ─── DELETE ───
  const openDelete = (author) => setDeleteDialog({ open: true, author });

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

  const closeModal = () => setFormModal({ open: false, mode: null, author: null });

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
            <span className="icon-badge">✍️</span>
            Manajemen Penulis
          </h2>
          <p className="crud-subtitle">Kelola data penulis dan informasi profil mereka</p>
        </div>
        <div className="crud-header-right">
          <div className="crud-stats">
            <div className="stat-chip">Penulis: <span>{authors.length}</span></div>
            <div className="stat-chip">Aktif: <span>{activeCount}</span></div>
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
            placeholder="Cari penulis berdasarkan nama, negara, atau bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-add" onClick={openCreate}>
          <span className="plus-icon">+</span>
          Tambah Penulis
        </button>
      </div>

      {/* ═══ TABLE ═══ */}
      <div className="crud-table-wrapper">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <p className="empty-title">
              {search ? 'Tidak ada hasil ditemukan' : 'Belum ada penulis'}
            </p>
            <p className="empty-desc">
              {search
                ? 'Coba kata kunci lain atau hapus filter pencarian'
                : 'Klik tombol "Tambah Penulis" untuk mendaftarkan penulis baru'}
            </p>
          </div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th style={{ width: '65px' }}>ID</th>
                <th>Nama Penulis</th>
                <th>Negara</th>
                <th>Bio</th>
                <th style={{ width: '80px' }}>Buku</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '150px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((author) => (
                <tr key={author.id} className={newRowId === author.id ? 'row-new' : ''}>
                  <td><span className="col-id">#{String(author.id).padStart(3, '0')}</span></td>
                  <td><span className="col-name">{author.name}</span></td>
                  <td>
                    <span className="col-country">
                      <span className="country-dot" />
                      {author.country}
                    </span>
                  </td>
                  <td><span className="col-desc" title={author.bio}>{author.bio}</span></td>
                  <td><span className="col-count">📖 {author.bookCount}</span></td>
                  <td>
                    <span className={`status-badge ${author.status === 'Active' ? 'active' : 'inactive'}`}>
                      <span className="status-dot" />
                      {author.status === 'Active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div className="col-actions">
                      <button className="btn btn-edit" onClick={() => openEdit(author)}>✏️ Edit</button>
                      <button className="btn btn-delete" onClick={() => openDelete(author)}>🗑️ Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length > 0 && (
          <div className="table-footer">
            <span>Menampilkan {filtered.length} dari {authors.length} penulis</span>
            <span>{search && 'Filter aktif — '}<span style={{ color: 'var(--admin-accent)' }}>{totalBooks} buku terkait</span></span>
          </div>
        )}
      </div>

      {/* ═══ CREATE / EDIT MODAL ═══ */}
      <Modal
        isOpen={formModal.open}
        onClose={closeModal}
        title={formModal.mode === 'create' ? 'Tambah Penulis Baru' : 'Edit Penulis'}
        mode={formModal.mode}
        footer={
          <>
            <button className="btn btn-cancel" onClick={closeModal}>Batal</button>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              {formModal.mode === 'create' ? '✚ Tambah Penulis' : '💾 Simpan Perubahan'}
            </button>
          </>
        }
      >
        {/* Nama */}
        <div className="form-group">
          <label className="form-label">
            Nama Penulis <span className="required">*</span>
          </label>
          <input
            ref={nameRef}
            className={`form-input ${errors.name ? 'error' : ''}`}
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Contoh: Tere Liye, Dee Lestari..."
            maxLength={80}
            onKeyDown={(e) => e.key === 'Enter' && handleFormSubmit()}
          />
          {errors.name ? (
            <p className="form-error">⚠ {errors.name}</p>
          ) : (
            <p className="form-hint">{form.name.length}/80 karakter</p>
          )}
        </div>

        {/* Negara */}
        <div className="form-group">
          <label className="form-label">
            Negara Asal <span className="required">*</span>
          </label>
          <select
            className={`form-select ${errors.country ? 'error' : ''}`}
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          >
            <option value="">— Pilih Negara —</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.country && <p className="form-error">⚠ {errors.country}</p>}
        </div>

        {/* Bio */}
        <div className="form-group">
          <label className="form-label">
            Bio / Deskripsi Singkat <span className="required">*</span>
          </label>
          <textarea
            className={`form-textarea ${errors.bio ? 'error' : ''}`}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tuliskan deskripsi singkat tentang penulis ini..."
            rows={3}
            maxLength={250}
          />
          {errors.bio ? (
            <p className="form-error">⚠ {errors.bio}</p>
          ) : (
            <p className="form-hint">{form.bio.length}/250 karakter</p>
          )}
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">Status</label>
          <div className="radio-group">
            {['Active', 'Inactive'].map((s) => (
              <label
                key={s}
                className={`radio-option ${form.status === s ? (s === 'Active' ? 'selected-active' : 'selected-inactive') : ''}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={form.status === s}
                  onChange={() => setForm({ ...form, status: s })}
                />
                {s === 'Active' ? '🟢 Aktif' : '⚪ Nonaktif'}
              </label>
            ))}
          </div>
        </div>

        {formModal.mode === 'edit' && (
          <div className="form-info-box">
            <p>
              ℹ️ Penulis ini memiliki <strong>{formModal.author?.bookCount} buku</strong> yang
              terdaftar di sistem.
            </p>
          </div>
        )}
      </Modal>

      {/* ═══ DELETE CONFIRM ═══ */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, author: null })}
        onConfirm={handleDelete}
        itemName={deleteDialog.author?.name}
        extraInfo={
          deleteDialog.author?.bookCount > 0
            ? `Penulis ini memiliki ${deleteDialog.author.bookCount} buku yang terkait.`
            : null
        }
      />
    </div>
  );
}