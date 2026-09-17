import React, { useState } from 'react';
import Link from 'next/link';

export default function ArtisansHub() {
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [commissionForm, setCommissionForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Master Artisans Guild Database
  const artisans = [
    {
      id: 'ART-01',
      name: 'Ustad Vikram Sharma',
      shopName: 'Royal Teak Atelier',
      location: 'Saharanpur, Uttar Pradesh',
      experience: '28 Years of Experience',
      specialty: '3D Wave Carving & Solid Teak Panels',
      bio: 'Third-generation woodcarver specializing in natural organic waveforms and architectural heritage wall accents.',
      rating: 4.95,
      totalArtworks: 18,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      badge: 'Master Craftsman',
    },
    {
      id: 'ART-02',
      name: 'Master Rajesh Soni',
      shopName: 'Jaipur Guild Woodworks',
      location: 'Jaipur, Rajasthan',
      experience: '22 Years of Experience',
      specialty: 'Mandala Inlay & Royal Jharokha Art',
      bio: 'Preserving Rajasthan’s royal palace wood carving traditions using single-piece seasoned rosewood and teak.',
      rating: 4.9,
      totalArtworks: 12,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      badge: 'Heritage Artisan',
    },
    {
      id: 'ART-03',
      name: 'Acharya Shankaran Pillai',
      shopName: 'Malabar Live-Edge Atelier',
      location: 'Wayanad, Kerala',
      experience: '35 Years of Experience',
      specialty: 'Live-Edge Sculptures & Organic Furniture',
      bio: 'Sustaining zero-waste forestry woodcraft, turning reclaimed 100-year-old teak roots into luxury statement art.',
      rating: 5.0,
      totalArtworks: 9,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
      badge: 'Master Veteran',
    },
    {
      id: 'ART-04',
      name: 'Farhan & Brothers Woodcraft',
      shopName: 'Jodhpur Heritage Carvings',
      location: 'Jodhpur, Rajasthan',
      experience: '19 Years of Experience',
      specialty: 'Hand-Turned Artifacts & Accent Mirrors',
      bio: 'Renowned for intricate floral geometric latticework (Jaali) and traditional beeswax hand-buffing.',
      rating: 4.88,
      totalArtworks: 14,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
      badge: 'Guild Certified',
    },
  ];

  const handleCommissionSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setCommissionForm(false);
      setSelectedArtisan(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#24211D] font-sans antialiased">
      
      {/* Top Banner */}
      <div className="bg-[#182119] text-[#E8DCC4] text-[11px] font-medium tracking-widest text-center py-2 uppercase px-4">
        ✦ DIRECT MASTER ARTISAN GUILD & HERITAGE WORKSHOPS ✦
      </div>

      {/* Main Navigation Header */}
      <header className="bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#E7DEC8] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#182119] flex items-center justify-center text-amber-200 text-lg shadow">
              🪵
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-widest text-[#182119] block">AL-YALA</span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-stone-500 font-semibold">Artisans Hub</span>
            </div>
          </Link>

          <div className="flex items-center gap-5 text-xs font-semibold">
            <Link href="/" className="text-stone-700 hover:text-[#182119] transition">
              ← Storefront
            </Link>
            <Link href="/track" className="text-stone-700 hover:text-[#182119] transition">
              🚚 Track Order
            </Link>
            <Link href="/admin" className="text-stone-500 hover:text-[#182119] transition">
              ⚙ Admin Panel
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 text-center space-y-3">
        <span className="text-[11px] tracking-widest font-bold uppercase bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full">
          The Guild of Master Woodworkers
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#182119]">
          Meet the Artisans Behind the Woodcraft
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
          Every artwork on AL-YALA is carved by certified master artisans across traditional woodworking hubs in India. Connect directly or commission bespoke heirlooms.
        </p>
      </section>

      {/* Artisans Grid */}
      <main className="max-w-6xl mx-auto px-6 py-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Cover Artwork Image */}
              <div className="relative h-48 w-full bg-stone-100">
                <img
                  src={artisan.coverImage}
                  alt={artisan.shopName}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-[#182119]/85 backdrop-blur-md text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  ★ {artisan.rating} Rating
                </span>
              </div>

              {/* Artisan Profile Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 -mt-12 mb-3">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
                    />
                    <div className="pt-6">
                      <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                        {artisan.badge}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#182119] mt-0.5">
                        {artisan.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-semibold">{artisan.shopName}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
                    <p className="flex items-center gap-1.5">
                      <span>📍</span> <span className="font-medium">{artisan.location}</span> • <span className="text-stone-400">{artisan.experience}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span>🪵</span> <span className="font-semibold text-stone-800">{artisan.specialty}</span>
                    </p>
                    <p className="text-stone-500 text-[11px] leading-relaxed pt-1">
                      {artisan.bio}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-stone-400 font-medium">
                    {artisan.totalArtworks} Artworks Listed
                  </span>

                  <button
                    onClick={() => {
                      setSelectedArtisan(artisan);
                      setCommissionForm(true);
                    }}
                    className="bg-[#182119] hover:bg-[#2A382C] text-amber-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow"
                  >
                    ✦ Request Custom Commission
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Commission Request Modal */}
      {commissionForm && selectedArtisan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setCommissionForm(false)}
              className="absolute top-4 right-5 text-stone-400 hover:text-stone-700 text-lg font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Custom Commission
              </span>
              <h3 className="font-serif font-bold text-xl text-[#182119] mt-1">
                Direct Inquiry to {selectedArtisan.name}
              </h3>
              <p className="text-xs text-stone-400">{selectedArtisan.shopName} • {selectedArtisan.location}</p>
            </div>

            {messageSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xl text-center">
                ✓ Inquiry sent directly to {selectedArtisan.name}’s workshop! They will review your dimensions & design within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleCommissionSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayaan Khan"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#182119]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Contact Email / Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ayaan@example.com / +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#182119]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Bespoke Artwork Requirements *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Specify dimensions (e.g. 4ft x 2ft), wood choice (Teak/Rosewood), and custom design details..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#182119]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#182119] hover:bg-[#2A382C] text-amber-50 py-3 rounded-xl font-bold uppercase tracking-wider transition shadow text-xs mt-2"
                >
                  Send Inquiry to Workshop
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#182119] text-[#E8DCC4] py-10 px-6 mt-16 text-center text-xs">
        <p className="font-serif font-bold text-sm text-amber-100 mb-1">AL-YALA Artisans Guild Network</p>
        <p className="text-stone-400">© {new Date().getFullYear()} Supporting Traditional Indian Woodcraft Masters.</p>
      </footer>

    </div>
  );
}