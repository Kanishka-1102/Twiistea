import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';

export default function BannerStrip() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    api.get('/banners').then(r => setBanners(r.data.filter(b => b.position === 'top'))).catch(() => {});
    const timer = setInterval(() => setCurrent(c => (c + 1) % Math.max(1, banners.length)), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length || dismissed) return null;
  const banner = banners[current];

  return (
    <div className="relative text-white text-sm py-2.5 px-4 text-center animate-fade-in flex items-center justify-center gap-4"
      style={{ backgroundColor: banner.backgroundColor || '#1a4a2e', color: banner.textColor || '#ffffff' }}>
      <div className="flex-1 flex items-center justify-center gap-4">
        {banners.length > 1 && (
          <button onClick={() => setCurrent((current - 1 + banners.length) % banners.length)} className="opacity-60 hover:opacity-100 transition-opacity">
            <ChevronLeft size={16} />
          </button>
        )}
        <p className="font-medium">
          {banner.title}
          {banner.subtitle && <span className="ml-2 opacity-80 font-normal">{banner.subtitle}</span>}
          {banner.link && banner.ctaText && (
            <a href={banner.link} className="ml-3 underline font-semibold hover:no-underline">{banner.ctaText}</a>
          )}
        </p>
        {banners.length > 1 && (
          <button onClick={() => setCurrent((current + 1) % banners.length)} className="opacity-60 hover:opacity-100 transition-opacity">
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      <button onClick={() => setDismissed(true)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}
