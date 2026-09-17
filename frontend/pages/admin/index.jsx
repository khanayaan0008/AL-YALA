import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminConsole() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'live', 'orders'

  // Default demo products waiting for audit
  const defaultAuditProducts = [
    {
      _id: 'prod-mod-1',
      title: 'hand-made mirror',
      woodType: 'Sheesham',
      price: 499,
      description: 'Hand-made wooden art mirror frame with natural oil polish.',
      storeName: 'AL-YALA Atelier',
      storeAddress: 'Workshop #12, Lakdi Mandi, Saharanpur, UP',
      storePhone: '+91 98765 43210',
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'],
      isApproved: false
    }
  ];

  // Default demo live products
  const defaultLiveProducts = [
    {
      _id: 'prod-1',
      title: 'Wooden pooja mandir',
      woodType: 'Sheesham',
      price: 599,
      description: 'Hand-carved solid Sheesham wood temple.',
      storeName: 'AL-YALA Heritage Mandir Atelier',
      storeAddress: 'Shop #14, Lakdi Mandi Chowk, Saharanpur, UP',
      storePhone: '+91 98765 43210',
      images: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80'],
      isApproved: true
    }
  ];

  useEffect(() => {
    // Load seller products from storage
    const saved = localStorage.getItem('alyala_seller_products');
    if (saved && JSON.parse(saved).length > 0) {
      setProducts(JSON.parse(saved));
    } else {
      const combined = [...defaultAuditProducts, ...defaultLiveProducts];
      setProducts(combined);
      localStorage.setItem('alyala_seller_products', JSON.stringify(combined));
    }

    // Load orders
    const savedOrders = localStorage.getItem('alyala_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) {}
    }
  }, []);

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem('alyala_seller_products', JSON.stringify(updated));
  };

  // 1. Approve Product Handler
  const handleApprove = (id) => {
    const updated = products.map((p) => (p._id === id ? { ...p, isApproved: true } : p));
    saveProducts(updated);
    alert('Product Approved Successfully!');
  };

  // 2. Reject / Delete Product Handler
  const handleReject = (id) => {
    if (!window.confirm('Are you sure you want to reject and remove this listing?')) return;
    const updated = products.filter((p) => p._id !== id);
    saveProducts(updated);
    alert('Product rejected and removed from moderation queue.');
  };

  const pendingProducts = products.filter((p) => !p.isApproved);
  const liveProducts = products.filter((p) => p.isApproved);

  // Platform cut calculation (10% commission on orders)
  const totalOrderRevenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  const platformFeeCut = (totalOrderRevenue * 0.1).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#24211D] font-sans antialiased p-4 md:p-10">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#182119]">Admin Console</h1>
          </div>
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider mt-0.5">
            Quality Review & Artisan Moderation Platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/seller/dashboard" 
            className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-full text-xs font-bold transition"
          >
            Artisan Hub
          </Link>
          <Link 
            href="/" 
            className="bg-[#182119] hover:bg-[#2A382C] text-amber-100 px-4 py-2 rounded-full text-xs font-bold transition shadow"
          >
            ← View Storefront
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Audit Queue</span>
          <span className="text-2xl font-serif font-black text-amber-900 mt-1 block">
            {pendingProducts.length}
          </span>
          <span className="text-[11px] text-stone-500">Awaiting Approval</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Live Catalog</span>
          <span className="text-2xl font-serif font-black text-emerald-800 mt-1 block">
            {liveProducts.length}
          </span>
          <span className="text-[11px] text-stone-500">Active on Storefront</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Total Orders</span>
          <span className="text-2xl font-serif font-black text-[#182119] mt-1 block">
            {orders.length}
          </span>
          <span className="text-[11px] text-stone-500">Customer Bookings</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Platform Fee Cut</span>
          <span className="text-2xl font-serif font-black text-[#182119] mt-1 block">
            ₹{platformFeeCut > 0 ? platformFeeCut : '404.5'}
          </span>
          <span className="text-[11px] text-stone-500">Commission Earned</span>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="max-w-6xl mx-auto mt-8 flex gap-3">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'bg-[#182119] text-amber-100'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <span>⏳</span>
          <span>Awaiting Quality Moderation ({pendingProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-2 ${
            activeTab === 'live'
              ? 'bg-[#182119] text-amber-100'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <span>✅</span>
          <span>Approved Live Catalog ({liveProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === 'queue' && (
        <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="text-lg font-serif font-bold text-[#182119] flex items-center gap-2">
              <span>🪵</span> Products Awaiting Quality Moderation ({pendingProducts.length})
            </h2>
            <p className="text-xs text-stone-500">Verify wood type, finish quality, and seller pricing before approving to the public storefront.</p>
          </div>

          {pendingProducts.length === 0 ? (
            <p className="text-stone-400 text-xs italic py-12 text-center">
              🎉 Moderation queue is clear! No products pending approval.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {pendingProducts.map((item) => (
                <div key={item._id} className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80'} 
                      alt={item.title} 
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          🪵 {item.storeName || 'Artisan Workshop'}
                        </span>
                        <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                          {item.woodType}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-stone-900">{item.title}</h3>
                      <p className="text-xs text-stone-500 line-clamp-1">{item.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-0.5">
                        <span className="font-black text-[#182119]">₹{item.price}</span>
                        <span>•</span>
                        <span>📍 {item.storeAddress || 'Saharanpur'}</span>
                        {item.storePhone && (
                          <>
                            <span>•</span>
                            <span>📞 {item.storePhone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button 
                      onClick={() => handleApprove(item._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
                    >
                      <span>✓</span> Approve Listing
                    </button>
                    <button 
                      onClick={() => handleReject(item._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl text-xs font-bold transition border border-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Catalog */}
      {activeTab === 'live' && (
        <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-stone-100">
            <h2 className="text-lg font-serif font-bold text-[#182119] flex items-center gap-2">
              <span>🌐</span> Active Live Store Listings ({liveProducts.length})
            </h2>
            <p className="text-xs text-stone-500">Products currently visible to customers on the home storefront.</p>
          </div>

          <div className="divide-y divide-stone-100">
            {liveProducts.map((item) => (
              <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={item.images?.[0]} 
                    alt={item.title} 
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ● Live
                    </span>
                    <h4 className="font-serif font-bold text-sm text-stone-900 mt-0.5">{item.title}</h4>
                    <p className="text-[11px] text-stone-500">₹{item.price} • {item.woodType} • {item.storeName}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleReject(item._id)}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  Delist / Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}