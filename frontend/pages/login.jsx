import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('seller'); // Default: Artisan / Seller
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Switch Role Tab
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    setEmail('');
    setPassword('');
  };

  // 2. Quick 1-Click Auto Fill
  const fillCredentials = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'seller') {
      setEmail('artisan@alyala.com');
      setPassword('seller123');
    } else {
      setEmail('admin@alyala.com');
      setPassword('admin123');
    }
  };

  // 3. Login Submission & Routing
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    // Artisan / Seller Login -> Opens Artisan Hub Dashboard
    if (selectedRole === 'seller') {
      if ((inputEmail === 'artisan@alyala.com' && inputPass === 'seller123') || inputEmail.includes('artisan') || inputEmail.includes('seller')) {
        localStorage.setItem('alyala_user', JSON.stringify({ role: 'seller', email: inputEmail }));
        window.location.href = '/seller/dashboard';
        return;
      } else {
        setErrorMsg('Invalid Artisan Credentials! (Use: artisan@alyala.com / seller123)');
        return;
      }
    }

    // Admin Login -> Opens Admin Console
    if (selectedRole === 'admin') {
      if (inputEmail === 'admin@alyala.com' && inputPass === 'admin123') {
        localStorage.setItem('alyala_user', JSON.stringify({ role: 'admin', email: inputEmail }));
        window.location.href = '/admin';
        return;
      } else {
        setErrorMsg('Invalid Admin Credentials! (Use: admin@alyala.com / admin123)');
        return;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#24211D] font-sans antialiased flex flex-col justify-between p-4 md:p-8">
      
      {/* Navbar */}
      <div className="max-w-5xl w-full mx-auto flex justify-between items-center pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#182119] flex items-center justify-center text-amber-200 text-lg font-serif font-black shadow">
            🪵
          </div>
          <div>
            <h1 className="text-xl font-serif font-black tracking-widest text-[#182119]">AL-YALA</h1>
            <p className="text-[9px] tracking-wider text-stone-500 font-semibold uppercase">Wood Art & Atelier</p>
          </div>
        </Link>

        <Link 
          href="/" 
          className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-full text-xs font-bold transition shadow-sm"
        >
          ← Back to Store
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto bg-white p-7 md:p-9 rounded-[2.5rem] border border-stone-200 shadow-2xl space-y-5">
        
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Portal Gateway
          </span>
          <h2 className="text-2xl font-serif font-black text-[#182119] pt-1">
            {selectedRole === 'seller' ? '🪵 Artisan / Seller Login' : '🛡️ Admin Console Login'}
          </h2>
          <p className="text-xs text-stone-500">
            {selectedRole === 'seller' 
              ? 'Login to upload wood products & manage orders.' 
              : 'Login to review quality moderation & approvals.'}
          </p>
        </div>

        {/* Big Role Selection Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          <button
            type="button"
            onClick={() => handleRoleSelect('seller')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              selectedRole === 'seller'
                ? 'bg-[#182119] text-amber-200 shadow-md scale-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🪵</span>
            <span>Artisan Hub</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-[#182119] text-amber-200 shadow-md scale-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🛡️</span>
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-stone-700 block uppercase">
              {selectedRole === 'seller' ? 'Artisan Email Address *' : 'Admin Email Address *'}
            </label>
            <input 
              type="email"
              placeholder={selectedRole === 'seller' ? 'artisan@alyala.com' : 'admin@alyala.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#182119]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700 block uppercase">
              Password *
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#182119]"
              required
            />
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl text-[11px] text-stone-700 space-y-2">
            <span className="font-bold text-amber-900 block">⚡ Quick 1-Click Fill:</span>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => fillCredentials('seller')}
                className="flex-1 bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 py-1.5 rounded-xl font-bold text-[11px] transition text-center"
              >
                🪵 Fill Artisan Login
              </button>
              <button 
                type="button" 
                onClick={() => fillCredentials('admin')}
                className="flex-1 bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 py-1.5 rounded-xl font-bold text-[11px] transition text-center"
              >
                🛡️ Fill Admin Login
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#182119] hover:bg-[#2A382C] text-amber-200 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
          >
            <span>
              {selectedRole === 'seller' ? 'Open Artisan Hub Dashboard →' : 'Open Admin Quality Console →'}
            </span>
          </button>
        </form>

      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-stone-400 py-2">
        © 2026 AL-YALA Wood Art & Atelier Studio
      </div>

    </div>
  );
}