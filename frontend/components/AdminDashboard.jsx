import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, TrendingUp, Package, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalCommissionEarned: 0, activeListings: 0 });
  const [pendingProducts, setPendingProducts] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const resStats = await fetch('http://localhost:5000/api/admin/platform-analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statsData = await resStats.json();
    if (statsData.success) setStats(statsData.analytics);

    const resPending = await fetch('http://localhost:5000/api/admin/pending-products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const pendingData = await resPending.json();
    if (pendingData.success) setPendingProducts(pendingData.products);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDecision = async (productId, isApproved) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/admin/product/${productId}/approve`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isApproved })
    });
    fetchData();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#FDFBF7] min-h-screen">
      <div className="flex justify-between items-center border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Admin Quality Command</h1>
          <p className="text-stone-500 text-sm">Platform supervision, quality review & revenue metrics</p>
        </div>
        <span className="bg-emerald-100 text-emerald-900 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> SuperAdmin
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Collected Platform Cut</span>
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-3xl font-bold text-stone-900">₹{stats.totalCommissionEarned || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Products</span>
            <Package className="w-5 h-5 text-stone-700" />
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.activeListings || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Audit Queue</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-900">{pendingProducts.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 font-bold text-stone-800">
          Products Awaiting Quality Moderation
        </div>
        <div className="divide-y divide-stone-100">
          {pendingProducts.map((p) => (
            <div key={p._id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={p.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-semibold text-stone-900">{p.title}</h4>
                  <p className="text-xs text-stone-500">Timber: {p.woodType} • Seller: {p.seller?.name}</p>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">₹{p.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDecision(p._id, true)} 
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button 
                  onClick={() => handleDecision(p._id, false)} 
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}