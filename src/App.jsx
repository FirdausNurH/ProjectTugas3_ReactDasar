// src/pages/Admin.jsx (atau sesuaikan path kamu)
import { useState } from 'react';
import Toast from '../components/admin/Toast';
import GenreManager from '../components/admin/GenreManager';
import AuthorManager from '../components/admin/AuthorManager';
import '../styles/admin-crud.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('genre');

  const tabs = [
    { key: 'genre', label: '📚 Genre', desc: 'Kelola kategori buku' },
    { key: 'author', label: '✍️ Penulis', desc: 'Kelola data penulis' },
  ];

  return (
    <div style={{ background: 'var(--admin-bg)', minHeight: '100vh' }}>
      <Toast />

      {/* ── Tab Bar ── */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 32px 0',
        display: 'flex',
        gap: '6px',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '14px 28px',
              borderRadius: '12px 12px 0 0',
              border: 'none',
              background: activeTab === tab.key
                ? 'var(--admin-surface)'
                : 'transparent',
              color: activeTab === tab.key
                ? 'var(--admin-accent)'
                : 'var(--admin-text-muted)',
              fontWeight: activeTab === tab.key ? '700' : '500',
              fontSize: '0.92rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab.key
                ? '2px solid var(--admin-accent)'
                : '2px solid transparent',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'genre' && <GenreManager />}
      {activeTab === 'author' && <AuthorManager />}
    </div>
  );
}