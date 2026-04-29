import { useState } from 'react';
import { books as initialBooks } from '../Utils/books';
import BookCard from '../components/BookCard';

export default function Books() {
  const [books, setBooks] = useState(initialBooks);
  const [newBook, setNewBook] = useState({ title: '', author: '', price: '', category: '' });

  const addBook = () => {
    if (!newBook.title || !newBook.author || !newBook.price) {
      alert("Judul, Penulis, dan Harga wajib diisi!");
      return;
    }

    const bookToAdd = {
      id: Date.now(),
      ...newBook,
      price: Number(newBook.price),
      image: `https://picsum.photos/id/${Math.floor(Math.random() * 900) + 100}/400/520`,
      stock: 25,
      rating: (4 + Math.random()).toFixed(1)
    };

    setBooks([...books, bookToAdd]);
    setNewBook({ title: '', author: '', price: '', category: '' });
    alert("🎉 Buku baru berhasil ditambahkan ke koleksi!");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-center mb-4">Semua Buku</h1>
      <p className="text-center text-gray-600 mb-12">Tambah buku baru sesukamu</p>

      {/* FORM TAMBAH BUKU */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-10 rounded-3xl mb-16 shadow-inner">
        <h2 className="text-3xl font-semibold mb-8 text-center">➕ Tambah Buku Baru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Judul Buku" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} className="p-5 rounded-2xl border focus:border-violet-500 focus:outline-none" />
          <input type="text" placeholder="Nama Penulis" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} className="p-5 rounded-2xl border focus:border-violet-500 focus:outline-none" />
          <input type="number" placeholder="Harga (Rp)" value={newBook.price} onChange={e => setNewBook({...newBook, price: e.target.value})} className="p-5 rounded-2xl border focus:border-violet-500 focus:outline-none" />
          <input type="text" placeholder="Kategori (misal: Fiction)" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} className="p-5 rounded-2xl border focus:border-violet-500 focus:outline-none" />
        </div>
        <button onClick={addBook} className="mt-8 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-5 rounded-2xl text-xl font-bold transition">
          Tambahkan Buku ke Koleksi
        </button>
      </div>

      {/* GRID BUKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {books.map(book => (
          <BookCard key={book.id} book={book} onAddToCart={() => alert(`🛒 ${book.title} ditambahkan!`)} />
        ))}
      </div>
    </div>
  );
}