export default function BookCard({ book, onAddToCart }) {
  return (
    <div className="book-card bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl group">
      <div className="relative">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-emerald-600">
          ⭐ {book.rating}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl line-clamp-2 mb-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{book.author}</p>
        
        <div className="flex justify-between items-end">
          <p className="text-3xl font-bold text-emerald-600">
            Rp {book.price.toLocaleString('id-ID')}
          </p>
          <button 
            onClick={() => onAddToCart(book)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition"
          >
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}