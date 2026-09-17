import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer'); // 'customer' | 'seller'
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const savedUsers = JSON.parse(localStorage.getItem('alyala_registered_users') || '[]');

    if (isLogin) {
      // 1. LOGIN LOGIC
      const user = savedUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        setError('This account is not registered. Please create an account first.');
        return;
      }

      if (user.status === 'Suspended') {
        setError('❌ Your account has been suspended by the administrator.');
        return;
      }

      localStorage.setItem('alyala_current_user', JSON.stringify(user));
      onAuthSuccess(user);
      onClose();
    } else {
      // 2. REGISTRATION LOGIC
      if (!name.trim() || !email.trim()) {
        setError('Please fill in all required fields.');
        return;
      }

      const userExists = savedUsers.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (userExists) {
        setError('This email address is already registered. Please sign in.');
        return;
      }

      const newUser = {
        id: role === 'seller' ? `SLR-${Math.floor(100 + Math.random() * 900)}` : `CUST-${Math.floor(100 + Math.random() * 900)}`,
        name: name.trim(),
        email: email.trim(),
        role: role,
        shopName: role === 'seller' ? (shopName.trim() || `${name}'s Studio`) : null,
        orders: 0,
        spent: 0,
        earnings: role === 'seller' ? 0 : null,
        productsCount: role === 'seller' ? 1 : 0,
        status: 'Active',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      const updatedUsers = [newUser, ...savedUsers];
      localStorage.setItem('alyala_registered_users', JSON.stringify(updatedUsers));
      localStorage.setItem('alyala_current_user', JSON.stringify(newUser));

      // Trigger live sync across open tabs
      window.dispatchEvent(new Event('storage'));

      onAuthSuccess(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-stone-400 hover:text-stone-700 text-lg font-bold"
        >
          ✕
        </button>

        <div className="text-center">
          <h3 className="font-serif font-bold text-xl text-[#182119]">
            {isLogin ? 'Account Login' : 'Join AL-YALA Network'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">Handcrafted Art & Woodwork Marketplace</p>
        </div>

        {/* Role Selector (On Register) */}
        {!isLogin && (
          <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                role === 'customer'
                  ? 'bg-[#182119] text-amber-100 shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🛍 Collector (Buyer)
            </button>
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                role === 'seller'
                  ? 'bg-[#182119] text-amber-100 shadow'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🪵 Artisan (Seller)
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {!isLogin && (
            <div>
              <label className="font-bold text-stone-600 block mb-1">
                {role === 'seller' ? 'Artisan / Master Woodworker Name' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Sharma"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#182119]"
              />
            </div>
          )}

          {!isLogin && role === 'seller' && (
            <div>
              <label className="font-bold text-stone-600 block mb-1">Workshop / Studio Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Royal Teak Crafts Studio"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#182119]"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-stone-600 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@alyala.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#182119]"
            />
          </div>

          <div>
            <label className="font-bold text-stone-600 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#182119]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#182119] hover:bg-[#2A382C] text-amber-50 py-3 rounded-xl font-bold uppercase tracking-wider transition shadow text-xs mt-2"
          >
            {isLogin ? 'Sign In' : `Register as ${role === 'seller' ? 'Artisan Seller' : 'Collector'}`}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          {isLogin ? (
            <p>
              New here?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }}
                className="text-[#182119] font-bold underline ml-1"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }}
                className="text-[#182119] font-bold underline ml-1"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}