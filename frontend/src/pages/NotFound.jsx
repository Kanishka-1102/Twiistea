import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-center px-4">
      <div>
        <p className="text-7xl mb-6">🍵</p>
        <h1 className="font-bold text-4xl text-[#1a1a1a] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          Page Not Found
        </h1>
        <p className="text-[#999] mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary inline-flex">Go Home</Link>
      </div>
    </div>
  );
}
