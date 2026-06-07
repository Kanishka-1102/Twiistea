import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Edit, Trash2, Search, X, Upload, Image, ChevronDown, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    category: product?.category || 'tea',
    subCategory: product?.subCategory || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    stock: product?.stock || '',
    weight: product?.weight || '',
    tags: product?.tags?.join(', ') || '',
    ingredients: product?.ingredients?.join(', ') || '',
    brewingInstructions: product?.brewingInstructions || '',
    isActive: product?.isActive !== false,
    isFeatured: product?.isFeatured || false,
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [toRemove, setToRemove] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFiles = (selected) => {
    const arr = Array.from(selected);
    setFiles(prev => [...prev, ...arr]);
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPreviews(prev => [...prev, e.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeNewFile = (i) => {
    setFiles(prev => prev.filter((_, j) => j !== i));
    setPreviews(prev => prev.filter((_, j) => j !== i));
  };

  const toggleRemoveExisting = (publicId) => {
    setToRemove(prev => prev.includes(publicId) ? prev.filter(p => p !== publicId) : [...prev, publicId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) return toast.error('Fill all required fields');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));
      if (toRemove.length) fd.append('removeImages', JSON.stringify(toRemove));
      fd.set('folder', 'twistea/products');

      if (product?._id) {
        await api.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onCancel} className="p-2 rounded-xl hover:bg-cream-100 transition-colors"><ArrowLeft size={20} /></button>
        <h2 className="font-display text-2xl text-primary-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-primary-800">Basic Information</h3>
            <div>
              <label className="text-sm font-medium text-tea-dark mb-1.5 block">Product Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-medium text-tea-dark mb-1.5 block">Short Description</label>
              <input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} className="input-field" placeholder="One line summary" />
            </div>
            <div>
              <label className="text-sm font-medium text-tea-dark mb-1.5 block">Full Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5} className="input-field" required />
            </div>
            <div>
              <label className="text-sm font-medium text-tea-dark mb-1.5 block">Brewing Instructions</label>
              <textarea value={form.brewingInstructions} onChange={e => setForm(f => ({ ...f, brewingInstructions: e.target.value }))} rows={3} className="input-field" placeholder="How to brew..." />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <h3 className="font-heading text-lg font-semibold text-primary-800 mb-4">Product Images</h3>
            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {existingImages.map((img, i) => (
                  <div key={i} className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 ${toRemove.includes(img.publicId) ? 'border-red-400 opacity-50' : 'border-cream-300'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => toggleRemoveExisting(img.publicId)}
                      className={`absolute inset-0 flex items-center justify-center transition-all ${toRemove.includes(img.publicId) ? 'bg-red-100/80' : 'bg-black/0 hover:bg-black/30'}`}>
                      <X size={20} className={toRemove.includes(img.publicId) ? 'text-red-600' : 'text-white opacity-0 hover:opacity-100'} />
                    </button>
                    {img.isPrimary && <span className="absolute bottom-1 left-1 text-xs bg-primary-700 text-white px-1.5 py-0.5 rounded-full">Main</span>}
                  </div>
                ))}
              </div>
            )}
            {/* New image previews */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary-300">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X size={10} />
                    </button>
                    <span className="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">New</span>
                  </div>
                ))}
              </div>
            )}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              className="border-2 border-dashed border-cream-400 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all">
              <Upload size={28} className="mx-auto text-tea-light mb-2" />
              <p className="text-sm text-tea-medium font-medium">Drop images here or click to upload</p>
              <p className="text-xs text-tea-light mt-1">PNG, JPG, WEBP up to 10MB each. Multiple allowed.</p>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
            <h3 className="font-heading text-base font-semibold text-primary-800">Pricing & Stock</h3>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field text-sm" min="0" required />
            </div>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Discount Price (₹)</label>
              <input type="number" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} className="input-field text-sm" min="0" placeholder="Leave blank for no discount" />
            </div>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Stock *</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field text-sm" min="0" required />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
            <h3 className="font-heading text-base font-semibold text-primary-800">Category</h3>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field text-sm">
                <option value="tea">Tea</option>
                <option value="merchandise">Merchandise</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Sub Category</label>
              <input value={form.subCategory} onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))} className="input-field text-sm" placeholder="e.g. Green Tea, Mugs..." />
            </div>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Weight</label>
              <input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} className="input-field text-sm" placeholder="e.g. 100g, 250g" />
            </div>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="input-field text-sm" placeholder="organic, darjeeling, first flush" />
            </div>
            <div>
              <label className="text-xs text-tea-light mb-1 block">Ingredients (comma separated)</label>
              <input value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} className="input-field text-sm" placeholder="Tea leaves, cardamom..." />
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
            <h3 className="font-heading text-base font-semibold text-primary-800">Visibility</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-primary-700' : 'bg-cream-400'}`} onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-tea-dark">Active (visible to customers)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.isFeatured ? 'bg-gold-500' : 'bg-cream-400'}`} onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-tea-dark">Featured on homepage</span>
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-4">
            {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 12, page });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {} finally { setLoading(false); }
  }, [search, category, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  if (creating) return <ProductForm onSave={() => { setCreating(false); fetchProducts(); }} onCancel={() => setCreating(false)} />;
  if (editing) return <ProductForm product={editing} onSave={() => { setEditing(null); fetchProducts(); }} onCancel={() => setEditing(null)} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-primary-800">Products <span className="text-tea-light text-base font-body font-normal">({total})</span></h1>
        <button onClick={() => setCreating(true)} className="btn-primary btn-sm"><Plus size={18} /> Add Product</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tea-light" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="input-field pl-9 text-sm py-2" />
        </div>
        <div className="flex gap-2">
          {[{ v: '', l: 'All' }, { v: 'tea', l: '🍃 Tea' }, { v: 'merchandise', l: '🎁 Merchandise' }].map(opt => (
            <button key={opt.v} onClick={() => { setCategory(opt.v); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${category === opt.v ? 'bg-primary-800 text-white' : 'bg-white border border-cream-300 text-tea-dark hover:border-primary-400'}`}>
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-64" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
          <Package size={48} className="mx-auto text-cream-400 mb-3" />
          <p className="text-tea-light mb-4">No products found</p>
          <button onClick={() => setCreating(true)} className="btn-primary">Add First Product</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-2xl shadow-soft overflow-hidden group">
              <div className="relative aspect-square bg-cream-100">
                {p.images?.[0]?.url ? (
                  <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🍵</div>
                )}
                {!p.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="badge bg-red-500 text-white">Hidden</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-end justify-center pb-3 gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setEditing(p)} className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-primary-700 hover:bg-primary-50 shadow flex items-center gap-1">
                    <Edit size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id, p.name)} className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-red-500 hover:bg-red-50 shadow flex items-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gold-600 capitalize font-medium">{p.category}</p>
                <p className="font-medium text-tea-dark text-sm truncate">{p.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="price-tag text-base">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</p>
                  <span className={`text-xs ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-green-600'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} in stock`}
                  </span>
                </div>
                {p.isFeatured && <span className="badge bg-gold-100 text-gold-700 text-xs mt-1">Featured</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-primary-800 text-white' : 'bg-white border border-cream-300 hover:border-primary-400'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
