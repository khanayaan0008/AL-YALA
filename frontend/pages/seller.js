import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SellerPortal() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Wood Art Form Fields
  const [title, setTitle] = useState('');
  const [woodType, setWoodType] = useState('CP / Burma Teakwood');
  const [craftCategory, setCraftCategory] = useState('3D Architectural Carvings');
  const [finishType, setFinishType] = useState('Natural Organic Beeswax');
  const [dimensions, setDimensions] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [price, setPrice] = useState('');
  const [artisanName, setArtisanName] = useState('');
  const [workshopCity, setWorkshopCity] = useState('Uttar Pradesh');
  const [sellerPhone, setSellerPhone] = useState('');
  const [craftStory, setCraftStory] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Live Camera Controls
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const formRef = useRef(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // All 28 States + 8 Union Territories of India
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi (NCT)',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Ultra-Lightweight Compressor
  const compressImage = (base64Str, maxWidth = 480, maxHeight = 480) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.55));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const safeSaveProducts = (newProductsList) => {
    try {
      localStorage.setItem('alyala_products', JSON.stringify(newProductsList));
    } catch (e) {
      try {
        localStorage.removeItem('alyala_cart');
        const trimmed = newProductsList.slice(0, 20);
        localStorage.setItem('alyala_products', JSON.stringify(trimmed));
      } catch (err) {}
    }
  };

  const loadWoodArtworks = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('alyala_products') || '[]');
      setProducts(saved);
    } catch (e) {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadWoodArtworks();
    window.addEventListener('storage', loadWoodArtworks);
    return () => {
      window.removeEventListener('storage', loadWoodArtworks);
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError('Camera access denied or device has no camera.');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 480, 360);
    
    const rawDataUrl = canvas.toDataURL('image/jpeg', 0.55);
    const compressed = await compressImage(rawDataUrl);
    setImagePreview(compressed);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result);
        setImagePreview(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  // Populate Form Fields for Editing
  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setTitle(product.title || '');
    setWoodType(product.woodType || 'CP / Burma Teakwood');
    setCraftCategory(product.category || '3D Architectural Carvings');
    setFinishType(product.finishType || 'Natural Organic Beeswax');
    setDimensions(product.dimensions || '');
    setWeightKg(product.weightKg ? product.weightKg.replace(/[^0-9.]/g, '') : '');
    setPrice(product.price || '');
    setArtisanName(product.artisan || '');
    setWorkshopCity(product.sellerCity || 'Uttar Pradesh');
    setSellerPhone(product.sellerPhone || '');
    setCraftStory(product.description || '');
    setImagePreview(product.image || '');

    // Smooth scroll back to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setTitle('');
    setDimensions('');
    setWeightKg('');
    setPrice('');
    setArtisanName('');
    setSellerPhone('');
    setCraftStory('');
    setImagePreview('');
  };

  // Create or Update Wood Artwork
  const handleSubmitWoodArt = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price || !artisanName.trim() || !sellerPhone.trim()) {
      alert('Please fill in all mandatory woodcraft details.');
      return;
    }

    if (!imagePreview) {
      alert('Please snap a live photo of your wood artwork or upload from gallery.');
      return;
    }

    const currentList = JSON.parse(localStorage.getItem('alyala_products') || '[]');

    if (editingProductId) {
      // UPDATE EXISTING PRODUCT
      const updatedList = currentList.map((item) => {
        if (item.id === editingProductId) {
          return {
            ...item,
            title: title.trim(),
            category: craftCategory,
            woodType: woodType,
            finishType: finishType,
            dimensions: dimensions.trim() || 'Custom Dimensions',
            weightKg: weightKg ? `${weightKg} kg` : 'Solid Wood Weight',
            artisan: artisanName.trim(),
            sellerCity: workshopCity,
            sellerPhone: sellerPhone.trim(),
            price: Number(price),
            originalPrice: Math.round(Number(price) * 1.25),
            image: imagePreview,
            description: craftStory.trim() || item.description,
            status: 'Pending', // Sent back for quick moderation
            updatedDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }
        return item;
      });

      safeSaveProducts(updatedList);
      setProducts(updatedList);
      setFeedbackMsg('✓ Product details updated successfully! Sent for Admin review.');
    } else {
      // CREATE NEW PRODUCT
      const newWoodArt = {
        id: `WOOD-${Date.now().toString().slice(-6)}`,
        title: title.trim(),
        category: craftCategory,
        woodType: woodType,
        finishType: finishType,
        dimensions: dimensions.trim() || 'Custom Dimensions',
        weightKg: weightKg ? `${weightKg} kg` : 'Solid Wood Weight',
        artisan: artisanName.trim(),
        sellerCity: workshopCity,
        sellerPhone: sellerPhone.trim(),
        price: Number(price),
        originalPrice: Math.round(Number(price) * 1.25),
        rating: 5.0,
        reviewsCount: 0,
        tag: '100% Solid Wood',
        image: imagePreview,
        description: craftStory.trim() || 'Seasoned hardwood hand-carved with traditional chisel techniques and finished with organic protective oils.',
        status: 'Pending',
        submittedDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      const updatedList = [newWoodArt, ...currentList];
      safeSaveProducts(updatedList);
      setProducts(updatedList);
      setFeedbackMsg('✓ Wood artwork submitted successfully! Queued for Admin approval.');
    }

    window.dispatchEvent(new Event('storage'));

    // Reset Form
    handleCancelEdit();
    setTimeout(() => setFeedbackMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1D1A16] font-sans antialiased selection:bg-amber-300/40">
      
      {/* Top Banner */}
      <div className="bg-[#121B13] text-[#EFE7D5] text-[11px] font-bold py-2.5 px-6 text-center tracking-[0.2em] uppercase">
        🪵 AL-YALA MASTER ARTISAN GUILD • SELLER WORKSHOP STUDIO 🪵
      </div>

      {/* Navigation Header */}
      <header className="bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#E3DAC8] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#121B13] flex items-center justify-center text-amber-200 text-xl shadow">
              🪵
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-[0.15em] text-[#121B13] block leading-none">AL-YALA</span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#7A6E5D] font-extrabold block mt-1">Seller Studio</span>
            </div>
          </Link>

          <div className="flex items-center gap-5 text-xs font-bold">
            <Link href="/" className="text-stone-700 hover:text-[#121B13] transition">
              ← Main Wood Store
            </Link>
            <Link href="/admin" className="text-stone-600 hover:text-[#121B13] transition">
              ⚙ Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-widest font-black uppercase bg-[#EDE4D4] text-[#7A4B17] px-4 py-1.5 rounded-full border border-[#DDCFBA]">
            {editingProductId ? 'Editing Mode Active' : 'Artisan Woodworker Studio'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#121B13]">
            {editingProductId ? 'Update Wood Artwork Details' : 'List Your Wood Carving / Furniture'}
          </h1>
          <p className="text-xs text-[#6B5F4E] max-w-md mx-auto font-medium">
            {editingProductId 
              ? 'Modify specifications, prices, or photos below and save changes.' 
              : 'Direct marketplace for master carvers, joiners, and wood sculptors across India.'}
          </p>
        </div>

        {/* Success Alert */}
        {feedbackMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 shadow-sm font-bold animate-fade-in">
            <span>✓</span> {feedbackMsg}
          </div>
        )}

        {/* 1. FORM CONTAINER */}
        <div ref={formRef} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DAC8] shadow-sm space-y-6">
          <div className="border-b border-[#EFE8DA] pb-3 flex justify-between items-center">
            <h2 className="font-serif font-black text-lg text-[#121B13] flex items-center gap-2">
              <span>{editingProductId ? '✏️' : '🪵'}</span>
              <span>{editingProductId ? `Edit Artwork (${editingProductId})` : 'Artwork Details & Timber Specifications'}</span>
            </h2>
            {editingProductId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-xl text-[11px] font-bold hover:bg-rose-100"
              >
                ✕ Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitWoodArt} className="space-y-5 text-xs">
            
            {/* Title */}
            <div>
              <label className="font-bold text-[#1D1A16] block mb-1">Wood Artwork Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Imperial Hand-Carved Teakwood Wave Sculpture"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DAC8] bg-[#FAF7F2] focus:bg-white focus:outline-[#121B13] font-medium"
              />
            </div>

            {/* Timber Type & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Timber / Wood Species *</label>
                <select
                  value={woodType}
                  onChange={(e) => setWoodType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DAC8] bg-[#FAF7F2] focus:bg-white focus:outline-[#121B13] font-medium"
                >
                  <option value="CP / Burma Teakwood">CP / Burma Teakwood (Sagwan)</option>
                  <option value="Indian Sheesham (Rosewood)">Indian Sheesham (Rosewood)</option>
                  <option value="Kashmir Walnut Wood">Kashmir Walnut Wood</option>
                  <option value="Reclaimed Antique Teak Root">Reclaimed Antique Teak Root</option>
                  <option value="Red Sandalwood Accent">Red Sandalwood Accent</option>
                  <option value="Mango Wood with Brass Inlay">Mango Wood (with Tarkashi)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Carving Style / Category *</label>
                <select
                  value={craftCategory}
                  onChange={(e) => setCraftCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DAC8] bg-[#FAF7F2] focus:bg-white focus:outline-[#121B13] font-medium"
                >
                  <option value="3D Architectural Carvings">3D Architectural Sculptures</option>
                  <option value="Mandala & Jharokha Wall Art">Mandala & Jharokha Wall Art</option>
                  <option value="Live-Edge Organic Furniture">Live-Edge Organic Furniture</option>
                  <option value="Handcrafted Figurines & Statues">Handcrafted Figurines & Statues</option>
                  <option value="Turned Teak Bowls & Tableware">Turned Teak Centerpieces</option>
                  <option value="Latticework (Jaali) Mirrors">Latticework (Jaali) Mirrors</option>
                </select>
              </div>
            </div>

            {/* Polish & Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Polish & Treatment *</label>
                <select
                  value={finishType}
                  onChange={(e) => setFinishType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DAC8] bg-[#FAF7F2] focus:bg-white focus:outline-[#121B13] font-medium"
                >
                  <option value="Natural Organic Beeswax">Natural Organic Beeswax Buff</option>
                  <option value="Pure Teakwood Oil Sealer">Pure Teakwood Oil Sealer</option>
                  <option value="Raw Natural Matte Finish">Raw Natural Matte Finish</option>
                  <option value="Antique Walnut Hand-Rubbed">Antique Walnut Hand-Rubbed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Asking Price (₹ INR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 24500"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E3DAC8] bg-[#FAF7F2] focus:bg-white focus:outline-[#121B13] font-medium"
                />
              </div>
            </div>

            {/* Dimensions & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E3DAC8]">
              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Dimensions (L × W × H)</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 36 in × 18 in × 12 in"
                  className="w-full px-3 py-2 rounded-xl border border-[#E3DAC8] bg-white focus:outline-[#121B13]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Net Weight (Approx. Kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 14.5"
                  className="w-full px-3 py-2 rounded-xl border border-[#E3DAC8] bg-white focus:outline-[#121B13]"
                />
              </div>
            </div>

            {/* Workshop Contact & State Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#121B13]/5 p-4 rounded-2xl border border-[#E3DAC8]">
              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Master Artisan / Studio *</label>
                <input
                  type="text"
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                  placeholder="e.g. Ustad Vikram Sharma"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E3DAC8] bg-white focus:outline-[#121B13]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">Workshop Hub Location (State/UT) *</label>
                <select
                  value={workshopCity}
                  onChange={(e) => setWorkshopCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E3DAC8] bg-white focus:outline-[#121B13] font-medium"
                >
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1D1A16] block mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="e.g. +91 98200 45678"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E3DAC8] bg-white focus:outline-[#121B13]"
                />
              </div>
            </div>

            {/* Photo Capture Section */}
            <div className="space-y-3">
              <label className="font-bold text-[#1D1A16] block">Wood Artwork Real Photo *</label>

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={startCamera}
                  className="bg-[#121B13] hover:bg-[#253626] text-amber-200 px-5 py-2.5 rounded-2xl font-bold transition shadow flex items-center gap-2"
                >
                  <span>📷</span> Snap Workshop Photo
                </button>

                <span className="text-stone-400 font-bold">OR</span>

                <label className="cursor-pointer bg-white border border-[#E3DAC8] hover:bg-[#FAF7F2] text-stone-700 px-4 py-2.5 rounded-2xl font-semibold transition shadow-sm flex items-center gap-2">
                  <span>📁</span> Upload From Gallery
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="relative inline-block mt-3 border-2 border-emerald-600 rounded-2xl overflow-hidden shadow-md">
                  <img src={imagePreview} alt="Woodcraft Preview" className="w-48 h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview('')}
                    className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-rose-600"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-700 text-white text-[10px] text-center py-1 font-bold">
                    ✓ Photo Attached
                  </div>
                </div>
              )}
            </div>

            {/* Story */}
            <div>
              <label className="font-bold text-[#1D1A16] block mb-1">Carving Technique & Timber Story</label>
              <textarea
                rows="3"
                value={craftStory}
                onChange={(e) => setCraftStory(e.target.value)}
                placeholder="Mention log seasoning age, hand-chisel depth, grain pattern, and protective wax finish..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E3DAC8] bg-[#FAF7F2] focus:bg-white focus:outline-[#121B13]"
              />
            </div>

            {/* Submit / Update Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#121B13] hover:bg-[#253626] text-amber-100 py-3.5 rounded-2xl font-black uppercase tracking-wider transition shadow-lg text-xs flex items-center justify-center gap-2"
              >
                <span>{editingProductId ? '💾' : '🪵'}</span>
                <span>{editingProductId ? 'Save & Update Artwork Details' : 'Submit Wood Artwork for Store Approval'}</span>
              </button>

              {editingProductId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-6 py-3.5 rounded-2xl font-bold text-xs transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 2. LISTINGS TABLE WITH EDIT BUTTON */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DAC8] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif font-black text-lg text-[#121B13]">Your Woodcraft Gallery</h2>
              <p className="text-xs text-[#7A6E5D] font-medium">Click Edit to modify any product details or pricing</p>
            </div>
            <span className="text-xs font-mono font-black bg-[#FAF7F2] text-[#121B13] border border-[#E3DAC8] px-3.5 py-1 rounded-full">
              {products.length} Artworks
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E3DAC8] text-[#7A6E5D] uppercase font-black text-[10px]">
                  <th className="py-3 px-4">Wood Artwork</th>
                  <th className="py-3 px-4">Timber & Style</th>
                  <th className="py-3 px-4">Workshop Hub</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Approval Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DA]">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-stone-400">
                      No wood artworks listed yet. Use the form above to list your first piece!
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-[#FAF7F2] transition ${editingProductId === item.id ? 'bg-amber-50/60' : ''}`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-[#E3DAC8]" />
                          <div>
                            <p className="font-bold text-[#121B13] text-sm">{item.title}</p>
                            <p className="text-[10px] text-stone-400">{item.artisan}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#121B13]">{item.woodType || 'Solid Teak'}</p>
                        <p className="text-[10px] text-stone-500">{item.category}</p>
                      </td>
                      <td className="py-3.5 px-4 text-stone-700 font-semibold">
                        📍 {item.sellerCity || 'India'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#121B13]">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black ${
                            item.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900 font-bold'
                          }`}
                        >
                          {item.status === 'Approved' ? '● Live on Store' : item.status === 'Rejected' ? '✕ Rejected' : '⏳ In Review'}
                        </span>
                      </td>
                      
                      {/* EDIT ACTION BUTTON */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleEditProduct(item)}
                          className="bg-[#121B13] hover:bg-[#253626] text-amber-200 px-3.5 py-1.5 rounded-xl font-bold text-[11px] shadow-sm transition inline-flex items-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full border border-stone-200 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h3 className="font-serif font-bold text-base text-[#121B13]">📸 Workshop Live Camera</h3>
              <button onClick={stopCamera} className="text-stone-400 hover:text-stone-700 font-bold text-lg">
                ✕
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs">{cameraError}</div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-inner">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-amber-400/40 pointer-events-none rounded-2xl" />
              </div>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-5 py-2.5 rounded-xl text-stone-600 font-semibold border border-stone-200 hover:bg-stone-50 text-xs"
              >
                Cancel
              </button>
              
              {!cameraError && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="bg-[#121B13] hover:bg-[#253626] text-amber-100 px-6 py-2.5 rounded-xl font-bold text-xs shadow flex items-center gap-2"
                >
                  <span>⚪</span> Capture Wood Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}