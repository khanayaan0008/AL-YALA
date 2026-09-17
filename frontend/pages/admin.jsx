import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('moderation'); // 'moderation' | 'customers' | 'sellers'
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Default seed data
  const defaultProducts = [
    {
      id: 1,
      title: 'Hand-Carved Royal Teakwood Wave Art',
      category: 'Master Sculptures',
      artisan: 'Vikram Sharma Atelier',
      price: 18500,
      originalPrice: 22000,
      rating: 4.9,
      reviewsCount: 38,
      tag: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      status: 'Approved',
      submittedDate: 'Aug 20, 2026'
    },
    {
      id: 2,
      title: 'Ancient Floral Mandala Carved Wall Panel',
      category: 'Wall Decor',
      artisan: 'Jaipur Guild Artisans',
      price: 24000,
      originalPrice: 28500,
      rating: 5.0,
      reviewsCount: 24,
      tag: 'Heritage Art',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      status: 'Approved',
      submittedDate: 'Aug 22, 2026'
    }
  ];

  const defaultUsers = [
    { id: 'CUST-101', name: 'Abdul Mannam', email: 'abdul@example.com', role: 'customer', orders: 4, spent: 145000, status: 'Active', joinedDate: 'Aug 10, 2026' },
    { id: 'SLR-201', name: 'Vikram Sharma', shopName: 'Sharma Teak Studio', email: 'vikram.wood@gmail.com', role: 'seller', productsCount: 12, earnings: 380000, status: 'Active', joinedDate: 'Aug 02, 2026' },
  ];

  // Load Data
  const syncData = () => {
    // 1. Products
    const savedProducts = localStorage.getItem('alyala_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('alyala_products', JSON.stringify(defaultProducts));
    }

    // 2. Users
    const savedUsers = localStorage.getItem('alyala_registered_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(defaultUsers);
      localStorage.setItem('alyala_registered_users', JSON.stringify(defaultUsers));
    }
  };

  useEffect(() => {
    syncData();
    window.addEventListener('storage', syncData);
    const interval = setInterval(syncData, 3000);
    return () => {
      window.removeEventListener('storage', syncData);
      clearInterval(interval);
    };
  }, []);

  // Save product state changes
  const updateProductsStorage = (updated) => {
    setProducts(updated);
    localStorage.setItem('alyala_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // 1. APPROVE PRODUCT
  const handleApprove = (id) => {
    const updated = products.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p));
    updateProductsStorage(updated);
  };

  // 2. REJECT PRODUCT
  const handleReject = (id) => {
    const updated = products.map((p) => (p.id === id ? { ...p, status: 'Rejected' } : p));
    updateProductsStorage(updated);
  };

  // 3. DELETE PRODUCT COMPLETELY
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      updateProductsStorage(updated);
    }
  };

  const pendingCount = products.filter((p) => p.status === 'Pending').length;
  const approvedCount = products.filter((p) => p.status === 'Approved').length;
  const customers = users.filter((u) => u.role === 'customer' || !u.role);
  const sellers = users.filter((u) => u.role === 'seller');

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#24211D] font-sans antialiased">
      
      {/* Top Header */}
      <header className="bg-[#182119] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400 text-[#182119] font-black text-[10px] tracking-wider px-2 py-0.5 rounded-md">
              ADMIN CONTROL
            </span>
            <h1 className="font-serif font-bold text-base sm:text-lg tracking-wider text-amber-100">
              AL-YALA Master Operations Panel
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/" className="text-stone-300 hover:text-white transition">
              Storefront ↗
            </Link>
            <Link href="/seller" className="text-stone-300 hover:text-white transition">
              Seller Portal ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Pending Approvals</p>
            <h3 className="text-3xl font-serif font-bold text-amber-600 mt-1">{pendingCount}</h3>
            <span className="text-[11px] text-stone-500 mt-1 block">Awaiting moderation</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Live On Storefront</p>
            <h3 className="text-3xl font-serif font-bold text-emerald-700 mt-1">{approvedCount}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">● Approved products</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Registered Sellers</p>
            <h3 className="text-3xl font-serif font-bold text-[#182119] mt-1">{sellers.length}</h3>
            <span className="text-[11px] text-stone-500 mt-1 block">Artisan workshops</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Active Customers</p>
            <h3 className="text-3xl font-serif font-bold text-[#182119] mt-1">{customers.length}</h3>
            <span className="text-[11px] text-stone-500 mt-1 block">Collectors registered</span>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-stone-300 pb-2">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'moderation'
                ? 'bg-[#182119] text-amber-100 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>📦</span> Product Approvals ({products.length})
            {pendingCount > 0 && (
              <span className="bg-amber-400 text-[#182119] px-2 py-0.5 rounded-full text-[10px]">
                {pendingCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'bg-[#182119] text-amber-100 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>👥</span> Customers ({customers.length})
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'sellers'
                ? 'bg-[#182119] text-amber-100 shadow'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>🪵</span> Sellers ({sellers.length})
          </button>
        </div>

        {/* 1. PRODUCT MODERATION QUEUE (OLX / AMAZON STYLE) */}
        {activeTab === 'moderation' && (
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif font-bold text-lg text-[#182119]">Seller Submitted Artworks</h2>
                <p className="text-xs text-stone-500">Approve to make live on storefront or delete unwanted listings</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-4">Artwork</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Artisan Studio</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border" />
                          <div>
                            <p className="font-bold text-stone-800 text-sm">{item.title}</p>
                            <p className="text-[10px] text-stone-400 font-mono">ID: {item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-600">{item.category}</td>
                      <td className="py-3.5 px-4 font-medium text-stone-700">{item.artisan}</td>
                      <td className="py-3.5 px-4 font-bold text-[#182119]">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900 font-black'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {item.status !== 'Approved' && (
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-sm transition"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {item.status !== 'Rejected' && (
                          <button
                            onClick={() => handleReject(item.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] shadow-sm transition"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl font-bold text-[11px] transition"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}