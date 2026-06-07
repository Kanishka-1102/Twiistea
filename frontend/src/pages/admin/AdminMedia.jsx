import { useState, useEffect, useRef } from 'react';
import { Upload, Image, Info, Check } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const CONFIGURABLE_IMAGES = [
  { key: 'hero_image', label: 'Hero Section Background', desc: 'Main landing page hero background image. Recommended: 1920×1080px', folder: 'twistea/site' },
  { key: 'hero_mobile_image', label: 'Hero Mobile Background', desc: 'Mobile version of hero. Recommended: 768×1024px', folder: 'twistea/site' },
  { key: 'category_tea_image', label: 'Tea Category Image', desc: 'Tea collection category card background. Recommended: 800×600px', folder: 'twistea/site' },
  { key: 'category_merch_image', label: 'Merchandise Category Image', desc: 'Merchandise category card background. Recommended: 800×600px', folder: 'twistea/site' },
  { key: 'about_hero_image', label: 'About Page Hero', desc: 'Background for the about us page. Recommended: 1600×900px', folder: 'twistea/site' },
  { key: 'logo_image', label: 'Brand Logo', desc: 'Main site logo. Recommended: 200×200px PNG with transparency', folder: 'twistea/site' },
];

function ImageConfig({ config: cfg, currentValue, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentValue?.url || null);
  const fileRef = useRef();

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('configKey', cfg.key);
      fd.append('label', cfg.label);
      fd.append('folder', cfg.folder);
      const { data } = await api.post('/upload/site-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPreview(data.url);
      onUpdate(cfg.key, { url: data.url, publicId: data.publicId });
      toast.success(`${cfg.label} updated!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      setPreview(currentValue?.url || null);
    } finally { setUploading(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      {/* Preview */}
      <div className="relative h-40 bg-cream-100 cursor-pointer group" onClick={() => fileRef.current.click()}>
        {preview ? (
          <>
            <img src={preview} alt={cfg.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center text-white">
                <Upload size={28} className="mb-1" />
                <p className="text-sm font-medium">Replace Image</p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-tea-light group-hover:text-primary-700 transition-colors">
            <Image size={32} className="mb-2" />
            <p className="text-sm font-medium">Click to Upload</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-primary-700 font-medium">Uploading...</p>
            </div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files[0])} />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-tea-dark text-sm">{cfg.label}</h4>
            <p className="text-xs text-tea-light mt-1 flex items-start gap-1">
              <Info size={11} className="mt-0.5 flex-shrink-0" />{cfg.desc}
            </p>
          </div>
          {preview && (
            <div className="flex-shrink-0">
              <span className="badge bg-green-100 text-green-700 text-xs flex items-center gap-1"><Check size={10} /> Set</span>
            </div>
          )}
        </div>
        <button onClick={() => fileRef.current.click()} disabled={uploading}
          className="mt-3 btn-secondary btn-sm text-xs w-full py-2">
          <Upload size={14} /> {preview ? 'Replace Image' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
}

export default function AdminMedia() {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/upload/site-config').then(r => setConfig(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpdate = (key, value) => setConfig(c => ({ ...c, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-primary-800">Site Images</h1>
        <p className="text-tea-light text-sm mt-1">Configure all images displayed on your website. Changes are live immediately after upload.</p>
      </div>

      <div className="bg-gold-50 border border-gold-200 rounded-2xl p-4 flex gap-3">
        <Info size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gold-800">
          <p className="font-semibold mb-0.5">All images are configurable</p>
          <p>Every image on the website can be replaced here. Upload your own images and they'll appear instantly across the site without any code changes.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-64" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONFIGURABLE_IMAGES.map(cfg => (
            <ImageConfig key={cfg.key} config={cfg} currentValue={config[cfg.key]} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
