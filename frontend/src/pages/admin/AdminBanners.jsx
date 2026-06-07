import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit, Upload, X, Calendar, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const POSITIONS = ['hero', 'top', 'middle', 'popup'];

function BannerForm({ banner, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    link: banner?.link || '',
    position: banner?.position || 'hero',
    ctaText: banner?.ctaText || '',
    backgroundColor: banner?.backgroundColor || '#1a4a2e',
    textColor: banner?.textColor || '#ffffff',
    priority: banner?.priority || 0,
    expiresAt: banner?.expiresAt ? new Date(banner.expiresAt).toISOString().slice(0, 16) : '',
    isActive: banner?.isActive !== false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(banner?.image?.url || null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!banner && !file) return toast.error('Please upload a banner image');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      fd.set('folder', 'twistea/banners');
      if (file) fd.append('image', file);
      if (banner) {
        await api.put(`/banners/${banner._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner updated!');
      } else {
        await api.post('/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner created!');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl text-primary-800">{banner ? 'Edit Banner' : 'Create Banner'}</h3>
        <button onClick={onCancel} className="p-2 rounded-xl hover:bg-cream-100 transition-colors"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-tea-dark mb-2 block">Banner Image {!banner && '*'}</label>
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              className="relative border-2 border-dashed border-cream-400 rounded-xl overflow-hidden cursor-pointer hover:border-primary-400 transition-colors"
              style={{ minHeight: '160px' }}>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Banner preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-tea-light">
                  <Upload size={28} className="mb-2" />
                  <p className="text-sm">Drop image or click to upload</p>
                  <p className="text-xs mt-1">Recommended: 1200×400px</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field text-sm" required />
          </div>
          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">Subtitle</label>
            <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="input-field text-sm" placeholder="Optional subtitle" />
          </div>
          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">CTA Text</label>
            <input value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} className="input-field text-sm" placeholder="Shop Now" />
          </div>
          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">Link URL</label>
            <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className="input-field text-sm" placeholder="/products?category=tea" />
          </div>
          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">Position</label>
            <select value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} className="input-field text-sm">
              {POSITIONS.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">Priority (higher = shown first)</label>
            <input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="input-field text-sm" min="0" />
          </div>
          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={form.backgroundColor} onChange={e => setForm(f => ({ ...f, backgroundColor: e.target.value }))}
                className="w-12 h-10 rounded-lg border border-cream-300 cursor-pointer" />
              <input value={form.backgroundColor} onChange={e => setForm(f => ({ ...f, backgroundColor: e.target.value }))} className="input-field text-sm flex-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-tea-dark mb-1.5 block">Text Color</label>
            <div className="flex gap-2">
              <input type="color" value={form.textColor} onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))}
                className="w-12 h-10 rounded-lg border border-cream-300 cursor-pointer" />
              <input value={form.textColor} onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))} className="input-field text-sm flex-1" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-tea-dark mb-1.5 block flex items-center gap-1.5"><Calendar size={14} /> Expiry Date & Time (leave blank = no expiry)</label>
            <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="input-field text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-primary-700' : 'bg-cream-400'}`} onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-tea-dark">Banner Active</span>
            </label>
          </div>
        </div>

        {/* Live Preview */}
        {preview && (
          <div className="mt-5">
            <p className="text-xs text-tea-light mb-2 font-medium uppercase tracking-wide">Preview</p>
            <div className="relative rounded-xl overflow-hidden h-32" style={{ background: form.backgroundColor }}>
              <img src={preview} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center px-8">
                <div>
                  <p className="font-display text-xl font-bold" style={{ color: form.textColor }}>{form.title || 'Banner Title'}</p>
                  {form.subtitle && <p className="text-sm opacity-80" style={{ color: form.textColor }}>{form.subtitle}</p>}
                  {form.ctaText && <span className="inline-block mt-2 px-4 py-1.5 bg-white/20 rounded-full text-xs font-semibold" style={{ color: form.textColor }}>{form.ctaText}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : banner ? 'Update Banner' : 'Create Banner'}</button>
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try { const { data } = await api.get('/banners/all'); setBanners(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    try { await api.delete(`/banners/${id}`); toast.success('Banner deleted'); fetchBanners(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleToggle = async (banner) => {
    try {
      const fd = new FormData();
      fd.append('isActive', !banner.isActive);
      await api.put(`/banners/${banner._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchBanners();
    } catch { toast.error('Failed to update'); }
  };

  if (creating) return <BannerForm onSave={() => { setCreating(false); fetchBanners(); }} onCancel={() => setCreating(false)} />;
  if (editing) return <BannerForm banner={editing} onSave={() => { setEditing(null); fetchBanners(); }} onCancel={() => setEditing(null)} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-primary-800">Banners</h1>
          <p className="text-tea-light text-sm">Manage promotional banners — set expiry for festive offers</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary btn-sm"><Plus size={18} /> Add Banner</button>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
          <p className="text-6xl mb-3">🎉</p>
          <p className="text-tea-light mb-4">No banners yet. Create your first promotional banner!</p>
          <button onClick={() => setCreating(true)} className="btn-primary">Create Banner</button>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map(banner => {
            const isExpired = banner.expiresAt && new Date(banner.expiresAt) < new Date();
            return (
              <div key={banner._id} className={`bg-white rounded-2xl shadow-soft overflow-hidden ${!banner.isActive || isExpired ? 'opacity-60' : ''}`}>
                <div className="flex gap-4 p-4">
                  <div className="relative w-48 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-cream-100">
                    <img src={banner.image?.url} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center px-4" style={{ background: banner.backgroundColor + '80' }}>
                      <p className="font-bold text-sm" style={{ color: banner.textColor }}>{banner.title}</p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-tea-dark">{banner.title}</h3>
                        {banner.subtitle && <p className="text-sm text-tea-light">{banner.subtitle}</p>}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="badge bg-cream-200 text-tea-medium text-xs capitalize">{banner.position}</span>
                          <span className={`badge text-xs ${banner.isActive && !isExpired ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {isExpired ? 'Expired' : banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {banner.expiresAt && (
                            <span className={`badge text-xs flex items-center gap-1 ${isExpired ? 'bg-red-100 text-red-600' : 'bg-gold-100 text-gold-700'}`}>
                              <Calendar size={10} />
                              Expires: {new Date(banner.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                          {!banner.expiresAt && <span className="badge bg-blue-100 text-blue-600 text-xs">No Expiry</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle(banner)} title={banner.isActive ? 'Deactivate' : 'Activate'}
                          className={`p-2 rounded-xl transition-colors ${banner.isActive ? 'hover:bg-red-50 text-green-600 hover:text-red-500' : 'hover:bg-green-50 text-tea-light hover:text-green-600'}`}>
                          {banner.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button onClick={() => setEditing(banner)} className="p-2 rounded-xl hover:bg-primary-50 text-primary-700 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(banner._id, banner.title)} className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {banner.link && <p className="text-xs text-tea-light mt-2">Link: <span className="text-primary-700">{banner.link}</span></p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
