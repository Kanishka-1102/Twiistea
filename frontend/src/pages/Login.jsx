import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, loading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password, form.phone);
        toast.success('Welcome to Twistea!');
      } else {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      }
      navigate(redirect);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F5F1EA] flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B4332' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <Link to="/" className="relative">
          <img
            src="/images/logo1.png"
            alt="TwisTea"
            style={{ height: '60px', width: 'auto', objectFit: 'contain', borderRadius: '10px', display: 'block' }}
          />
        </Link>

        <div className="relative text-center">
          <div className="text-8xl mb-8">🍵</div>
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Every Sip<br />Tells a Story
          </h2>
          <p className="text-[#777] text-lg leading-relaxed">
            Join thousands of tea lovers across India who trust Twistea for their daily ritual.
          </p>
        </div>

        <div className="relative flex justify-between text-[#999] text-sm">
          <span>50+ Tea Varieties</span>
          <span>10K+ Customers</span>
          <span>Pan-India Delivery</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <img
                src="/images/logo1.png"
                alt="TwisTea"
                style={{ height: '60px', width: 'auto', objectFit: 'contain', borderRadius: '10px', display: 'block', margin: '0 auto' }}
              />
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-[#999] text-sm mb-8">
            {isRegister ? 'Join the Twistea family today' : 'Sign in to continue your tea journey'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name" className="input-field" required />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" className="input-field" required />
            </div>
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">Phone (optional)</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210" className="input-field" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-[#1a1a1a] mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="At least 6 characters" className="input-field pr-12" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#555] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {isRegister ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <p className="text-[#999] text-sm text-center mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button onClick={() => setIsRegister(!isRegister)}
              className="text-[#1B4332] font-semibold hover:underline transition-colors">
              {isRegister ? 'Sign In' : 'Register Free'}
            </button>
          </p>

          <Link to="/" className="flex items-center justify-center gap-1 text-center mt-6 text-[#999] text-sm hover:text-[#1B4332] transition-colors">
            ← Continue shopping without signing in
          </Link>
        </div>
      </div>
    </div>
  );
}
