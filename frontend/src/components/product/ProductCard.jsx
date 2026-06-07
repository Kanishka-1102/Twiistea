import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const price = product.discountPrice || product.price;
  const discount = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const img = product.images?.[hovered && product.images.length > 1 ? 1 : 0]?.url;

  const handleCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart!`, { icon: '🍵' });
  };

  return (
    <Link to={`/products/${product._id}`} className="group block"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      {/* Image box */}
      <div className="relative rounded-xl overflow-hidden bg-[#F5F1EA] mb-3" style={{ aspectRatio: '1' }}>
        {img
          ? <img src={img} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🍵</div>
        }

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-[#1B4332] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-[#B5821F] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-[#888] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center bg-white shadow-sm transition-all duration-200 ${wishlisted ? 'text-red-500' : 'text-[#bbb] opacity-0 group-hover:opacity-100'}`}>
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Add to cart — appears on hover */}
        <div className={`absolute inset-x-0 bottom-0 p-2.5 transition-all duration-200 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button onClick={handleCart}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${product.stock === 0 ? 'bg-white/70 text-[#aaa] cursor-not-allowed' : 'bg-white text-[#1B4332] hover:bg-[#1B4332] hover:text-white shadow-sm'}`}>
            <ShoppingBag size={12} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-[#B5821F] text-[10px] font-semibold tracking-wider uppercase mb-1">
          {product.category === 'tea' ? 'Tea' : 'Merchandise'}
          {product.subCategory ? ` · ${product.subCategory}` : ''}
        </p>
        <h3 className="text-[#1a1a1a] text-sm font-medium leading-snug line-clamp-2 mb-1.5 group-hover:text-[#1B4332] transition-colors">
          {product.name}
        </h3>

        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={10}
                  className={s <= Math.round(product.ratings.average) ? 'text-[#B5821F] fill-[#B5821F]' : 'text-[#ddd]'} />
              ))}
            </div>
            <span className="text-[10px] text-[#aaa]">({product.ratings.count})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-[#1a1a1a] font-bold text-base">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {product.discountPrice && (
            <span className="text-[#bbb] text-xs line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-orange-500 text-[10px] mt-1">Only {product.stock} left</p>
        )}
      </div>
    </Link>
  );
}
