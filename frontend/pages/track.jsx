import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('ALYALA-8924');
  const [activeOrder, setActiveOrder] = useState(null);
  const [distance, setDistance] = useState(3.8);
  const [etaMinutes, setEtaMinutes] = useState(18);

  const sampleTrackingData = {
    'ALYALA-8924': {
      id: 'ALYALA-8924',
      product: 'Hand-Carved Royal Teakwood Wall Art',
      buyerName: 'Abdul Mannam',
      deliveryAddress: 'Bandra West, Mumbai, MH - 400050',
      carrier: 'BlueDart Eco-Express Logistic',
      trackingNo: 'BD-IND-902341',
      riderName: 'Vikram Sharma',
      riderPhone: '+91 98201 45678',
      currentStage: 3,
      timeline: [
        { title: 'Raw Wood Selection & Carving', time: 'Aug 20 - Master Artisan Studio', status: 'completed' },
        { title: 'Natural Beeswax Polish & Audit', time: 'Aug 21 - Quality Passed', status: 'completed' },
        { title: 'Dispatched via Secure Wooden Crate', time: 'Today 08:30 AM - Hub Center', status: 'completed' },
        { title: 'Out for Doorstep Handover', time: 'Live Now - Rider Approaching', status: 'current' },
        { title: 'White-Glove Delivery', time: 'Estimated in 20 Mins', status: 'pending' },
      ]
    }
  };

  const handleTrack = (customId) => {
    const searchId = (customId || orderId).trim().toUpperCase().replace('#', '');
    
    if (sampleTrackingData[searchId]) {
      setActiveOrder(sampleTrackingData[searchId]);
    } else {
      setActiveOrder({
        id: searchId || 'ALYALA-LIVE',
        product: 'Custom Artisan Woodcraft Piece',
        buyerName: 'Valued Collector',
        deliveryAddress: 'Customer Shipping Destination',
        carrier: 'AL-YALA Express Air Cargo',
        trackingNo: `AY-${Math.floor(100000 + Math.random() * 900000)}`,
        riderName: 'Rahul Verma',
        riderPhone: '+91 98765 43210',
        currentStage: 3,
        timeline: [
          { title: 'Artisan Wood Selection', time: 'Completed', status: 'completed' },
          { title: 'Kiln Drying & Finishing', time: 'Completed', status: 'completed' },
          { title: 'Eco-Packaging Dispatched', time: 'In Transit', status: 'completed' },
          { title: 'Out for Delivery', time: 'Approaching Destination', status: 'current' },
          { title: 'Delivered', time: 'Estimated today', status: 'pending' },
        ]
      });
    }
  };

  useEffect(() => {
    const lastOrder = typeof window !== 'undefined' ? localStorage.getItem('last_order_id') : null;
    const targetId = lastOrder || 'ALYALA-8924';
    setOrderId(targetId);
    handleTrack(targetId);
  }, []);

  useEffect(() => {
    if (!activeOrder) return;
    const interval = setInterval(() => {
      setDistance((prev) => (prev > 0.4 ? Number((prev - 0.2).toFixed(1)) : 0.3));
      setEtaMinutes((prev) => (prev > 2 ? prev - 1 : 2));
    }, 4000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#24211D] font-sans antialiased">
      {/* Top Banner */}
      <div className="bg-[#182119] text-[#E8DCC4] text-[11px] font-medium tracking-widest text-center py-2 uppercase px-4">
        ✦ AL-YALA REAL-TIME DISPATCH & ARTISAN LOGISTICS RADAR ✦
      </div>

      {/* Header */}
      <header className="bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#E7DEC8] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#182119] flex items-center justify-center text-amber-200 text-lg shadow">
              🪵
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-widest text-[#182119] block">AL-YALA</span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-semibold">Live Courier Tracker</span>
            </div>
          </Link>

          <Link href="/" className="text-xs font-semibold text-stone-700 hover:text-[#182119] transition">
            ← Back to Storefront
          </Link>
        </div>
      </header>

      {/* Main Tracker Container */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        
        {/* Search Input Bar */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full flex-1">
            <label className="text-[10px] uppercase font-bold text-stone-400 block ml-2 mb-1">Enter Tracking Number / Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ALYALA-8924"
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-sm font-medium focus:outline-[#182119]"
            />
          </div>
          <button
            onClick={() => handleTrack()}
            className="w-full sm:w-auto bg-[#182119] hover:bg-[#2A382C] text-amber-50 px-8 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition shadow mt-2 sm:mt-4"
          >
            Locate Package
          </button>
        </div>

        {activeOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Live Radar & Summary */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Radar Card */}
              <div className="bg-[#182119] text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-stone-800">
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Courier Radar</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-amber-100 mt-1">Package in Transit</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Estimated Arrival</span>
                    <span className="text-2xl font-serif font-bold text-amber-300">{etaMinutes} Minutes</span>
                  </div>
                </div>

                {/* Animated Route Graphic */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/10 relative">
                  <div className="flex justify-between text-[11px] text-amber-200 font-semibold mb-2">
                    <span>Artisan Atelier (Dispatched)</span>
                    <span>Your Doorstep ({distance} km away)</span>
                  </div>
                  
                  <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden relative">
                    <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[78%] transition-all duration-1000" />
                  </div>
                  <p className="text-[10px] text-stone-300 mt-2 text-center">🚚 Delivery agent is approaching your doorstep</p>
                </div>

                {/* Rider Details */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-200 text-[#182119] flex items-center justify-center font-bold text-sm">
                      🛵
                    </div>
                    <div>
                      <p className="font-bold text-white">{activeOrder.riderName}</p>
                      <p className="text-[11px] text-stone-400">Assigned Logistics Associate</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${activeOrder.riderPhone}`}
                    className="bg-white/10 hover:bg-white/20 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold border border-white/15 transition"
                  >
                    📞 Call Rider
                  </a>
                </div>
              </div>

              {/* Order Item Summary */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                <h3 className="font-serif font-bold text-base text-[#182119]">Wood Artwork Summary</h3>
                <div className="flex justify-between items-center text-xs py-2 border-b border-stone-100">
                  <span className="text-stone-500">Order ID:</span>
                  <span className="font-bold text-[#182119]">#{activeOrder.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2 border-b border-stone-100">
                  <span className="text-stone-500">Artwork:</span>
                  <span className="font-bold text-[#182119]">{activeOrder.product}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2 border-b border-stone-100">
                  <span className="text-stone-500">Destination:</span>
                  <span className="font-bold text-stone-700">{activeOrder.deliveryAddress}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2">
                  <span className="text-stone-500">Waybill:</span>
                  <span className="font-mono font-bold text-emerald-800">{activeOrder.trackingNo}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#182119] mb-4">Milestone Tracker</h3>

                <div className="relative border-l-2 border-emerald-800/30 ml-3 space-y-6 pl-5 py-2">
                  {activeOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                          step.status === 'completed'
                            ? 'bg-emerald-700'
                            : step.status === 'current'
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-stone-300'
                        }`}
                      />
                      <div>
                        <h4 className={`text-xs font-bold ${step.status === 'pending' ? 'text-stone-400' : 'text-[#182119]'}`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-0.5">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center mt-6">
                <p className="text-xs font-bold text-stone-800">Need Delivery Assistance?</p>
                <button 
                  onClick={() => alert('Support: support@al-yala.com | Toll-Free: 1800-WOOD-ART')}
                  className="mt-2 text-xs font-semibold text-[#182119] underline"
                >
                  Contact White-Glove Desk
                </button>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}