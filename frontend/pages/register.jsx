import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    shopName: ''
  });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'seller') router.push('/seller/dashboard');
      else router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="bg-white border border-[#ECE5D8] rounded-3xl p-8 max-w-md w-full shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl mb-3">
            <Leaf className="w-6 h-6 text-emerald-800" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Create Account</h2>
          <p className="text-xs text-stone-500 mt-1">Join as a buyer or artisan craftsman</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl mb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'buyer' })}
              className={`py-2 rounded-lg transition ${formData.role === 'buyer' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'seller' })}
              className={`py-2 rounded-lg transition ${formData.role === 'seller' ? 'bg-[#2B3A29] text-white shadow' : 'text-stone-500'}`}
            >
              Artisan (Seller)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
            />
          </div>

          {formData.role === 'seller' && (
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Woodcraft Brand Name</label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="Heritage Teak Studios"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2B3A29] hover:bg-emerald-950 text-white font-medium py-3 rounded-xl transition text-sm shadow mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-stone-500 mt-5">
          Already have an account? <Link href="/login" className="text-emerald-800 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}