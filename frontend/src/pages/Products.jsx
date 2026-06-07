import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/product/ProductCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 12, page });
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const title = search ? `Search: "${search}"` : category === 'tea' ? 'Tea Collection' : category === 'merchandise' ? 'Merchandise' : 'All Products';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F5F1EA] pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#B5821F] text-xs font-semibold tracking-[3px] uppercase mb-2">Collection</p>
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h1>
          <p className="text-[#999] text-sm">{total} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#F0EBE3]">
          <div className="flex items-center gap-2 flex-wrap">
            {[{ v: '', l: 'All' }, { v: 'tea', l: '🍃 Tea' }, { v: 'merchandise', l: '🎁 Merchandise' }].map(opt => (
              <button key={opt.v} onClick={() => updateParam('category', opt.v)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${category === opt.v ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-[#555] border-[#E5DDD0] hover:border-[#1B4332] hover:text-[#1B4332]'}`}>
                {opt.l}
              </button>
            ))}
            {search && (
              <button onClick={() => updateParam('search', '')}
                className="flex items-center gap-1 text-xs px-3 py-2 rounded-full border border-[#E5DDD0] text-[#999] hover:border-red-300 hover:text-red-500 transition-colors bg-white">
                <X size={11} /> Clear search
              </button>
            )}
          </div>
          <div className="relative">
            <select value={sort} onChange={e => updateParam('sort', e.target.value)}
              className="appearance-none px-4 py-2 pr-7 text-sm text-[#555] bg-white border border-[#E5DDD0] rounded-lg focus:outline-none focus:border-[#1B4332] cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#bbb]" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton rounded-xl" style={{ height: 320 }} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl mb-4 block">🍵</span>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No products found</h3>
            <p className="text-[#999] mb-6 text-sm">Try a different category or search term</p>
            <button onClick={() => setSearchParams({})} className="btn-primary">View All Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(pages)].map((_, i) => (
              <button key={i} onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', i + 1); setSearchParams(p); }}
                className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all ${page === i + 1 ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-[#555] border-[#E5DDD0] hover:border-[#1B4332]'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
