import Toast from './components/admin/Toast';
import GenreManager from './components/admin/GenreManager';
import AuthorManager from './components/admin/AuthorManager';
import './styles/admin-crud.css';

// Di dalam component return:
function Admin() {
  const [activeTab, setActiveTab] = useState('genre');

  return (
    <div style={{ background: 'var(--admin-bg)', minHeight: '100vh' }}>
      <Toast />

      {/* Tab Navigation */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 32px 0',
        display: 'flex',
        gap: '8px',
      }}>
        {[
          { key: 'genre', label: '📚 Genre', },
          { key: 'author', label: '✍️ Penulis', },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 24px',
              borderRadius: '10px 10px 0 0',
              border: 'none',
              background: activeTab === tab.key ? 'var(--admin-surface)' : 'transparent',
              color: activeTab === tab.key ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
              fontWeight: activeTab === tab.key ? '700' : '500',
              fontSize: '0.92rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab.key
                ? '2px solid var(--admin-accent)'
                : '2px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'genre' && <GenreManager />}
      {activeTab === 'author' && <AuthorManager />}
    </div>
  );
}