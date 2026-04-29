import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-3xl font-bold text-indigo-700">
          📚 BookSales
        </Link>
        
        <nav className="flex gap-8 text-lg font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/books" className="hover:text-indigo-600 transition">Semua Buku</Link>
          <a href="#kategori" className="hover:text-indigo-600 transition">Kategori</a>
        </nav>
      </div>
    </header>
  );
}