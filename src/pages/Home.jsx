import { books } from '../Utils/books';
import BookCard from '../components/BookCard';
import { useState } from 'react';

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart([...cart, book]);
    alert(`✅ ${book.title} berhasil ditambahkan ke keranjang! 🛒`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER HERO - Lebih Menarik */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Temukan Buku yang<br />
            <span className="text-yellow-300">Mengubah Hidupmu</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90">
            Koleksi buku terbaik dari berbagai genre dengan harga terbaik
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR KIRI - Kategori */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              📚 Kategori
            </h3>
            <ul className="space-y-4 text-lg">
              {["Self-Improvement", "Finance", "Fiction", "Science Fiction", "Biography", "History", "Programming"].map((cat, i) => (
                <li key={i} className="hover:text-indigo-600 cursor-pointer transition flex items-center gap-2">
                  <span className="text-indigo-500">→</span> {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* MAIN CONTENT - Grid Buku */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-4xl font-bold">Koleksi Unggulan</h2>
            <a href="/books" className="text-indigo-600 hover:underline font-medium">
              Lihat Semua Buku →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={addToCart} />
            ))}
          </div>
        </div>

        {/* SIDEBAR KANAN - Trending */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              🔥 Trending Saat Ini
            </h3>
            <div className="space-y-8">
              {books.slice(0, 4).map((book, index) => (
                <div key={index} className="flex gap-4">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-20 h-28 object-cover rounded-xl shadow" 
                  />
                  <div className="flex-1">
                    <p className="font-semibold leading-tight line-clamp-2">{book.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                    <p className="text-emerald-600 font-bold mt-2">
                      Rp {book.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h4 className="text-white text-2xl font-bold mb-4">📚 BookSales</h4>
            <p>Toko buku online modern Indonesia</p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Navigasi</h5>
            <ul className="space-y-2">
              <li>Home</li>
              <li>Semua Buku</li>
              <li>Kategori</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Layanan</h5>
            <ul className="space-y-2">
              <li>Pengiriman Gratis</li>
              <li>Garansi Uang Kembali</li>
              <li>Hubungi Kami</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-4">Ikuti Kami</h5>
            <p>Instagram • TikTok • YouTube</p>
          </div>
        </div>
        <div className="text-center mt-12 text-sm border-t border-gray-800 pt-8">
          © 2026 BookSales • Dibuat dengan ❤️ untuk tugas React
        </div>
      </footer>
    </div>
  );
}