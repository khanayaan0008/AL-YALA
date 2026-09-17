import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // 1. New Product Form State
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    woodType: 'Sheesham',
    description: '',
    storeName: '',
    storeAddress: '',
    storePhone: '',
    image: ''
  });

  // 2. Edit Product State
  const [editingProduct, setEditingProduct] = useState(null);

  // 3. Live Webcam / Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isEditCamera, setIsEditCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // 4. New Order Form State (Manual Entry)
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    productTitle: '',
    price: '',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Crafting in Progress'
  });

  // 5. Update Delivery Date State
  const [editingOrder, setEditingOrder] = useState(null);

  // Default demo products
  const defaultArtisanProducts = [
    {
      _id: 'prod-1',
      title: 'Wooden pooja mandir',
      price: 599,
      woodType: 'Sheesham',
      description: 'Hand-carved premium Sheesham wood temple with intricate jali work.',
      storeName: 'AL-YALA Heritage Mandir Atelier',
      storeAddress: 'Shop #14, Lakdi Mandi Chowk, Saharanpur, UP',
      storePhone: '+91 98765 43210',
      images: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80'],
      isApproved: true
    },
    {
      _id: 'prod-2',
      title: 'Hand-Carved Wall Decor',
      price: 299,
      woodType: 'Oak',
      description: 'Vintage architectural wall relief frame hand-chiselled from seasoned solid Oak.',
      storeName: 'Ustad Rashid Art Studio',
      storeAddress: 'Plot 88, Artisan Industrial Area, Jodhpur, Rajasthan',
      storePhone: '+91 91234 56789',
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'],
      isApproved: true
    }
  ];

  // Default demo orders
  const defaultOrders = [
    {
      _id: 'ord-101',
      orderId: 'ALY-9021',
      productTitle: 'Wooden pooja mandir',
      price: 599,
      customerName: 'Ayaan Khan',
      customerPhone: '+91 98765 00000',
      deliveryAddress: 'Flat 402, Green Avenue, Bandra West, Mumbai - 400050',
      orderDate: '2026-08-24',
      deliveryDate: '2026-08-30',
      status: 'Crafting in Progress',
      courierPartner: 'BlueDart Express'
    }
  ];

  // Load Products & Orders
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProds = localStorage.getItem('alyala_seller_products');
      if (savedProds && JSON.parse(savedProds).length > 0) {
        setProducts(JSON.parse(savedProds));
      } else {
        setProducts(defaultArtisanProducts);
        localStorage.setItem('alyala_seller_products', JSON.stringify(defaultArtisanProducts));
      }

      const savedOrders = localStorage.getItem('alyala_orders');
      if (savedOrders && JSON.parse(savedOrders).length > 0) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(defaultOrders);
        localStorage.setItem('alyala_orders', JSON.stringify(defaultOrders));
      }
    }
  }, []);

  const saveProducts = (updated) => {
    setProducts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alyala_seller_products', JSON.stringify(updated));
    }
  };

  const saveOrders = (updated) => {
    setOrders(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('alyala_orders', JSON.stringify(updated));
    }
  };

  // 📷 1. START LIVE WEBCAM CAMERA
  const startLiveCamera = async (isEdit = false) => {
    setIsEditCamera(isEdit);
    setCameraError('');
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera Error:', err);
      setCameraError('Camera access denied or webcam not found. Please grant browser camera permission.');
    }
  };

  // 📸 2. CAPTURE / SNAP PHOTO FROM LIVE STREAM
  const captureLivePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const capturedBase64 = canvas.toDataURL('image/jpeg', 0.85);

    if (isEditCamera && editingProduct) {
      setEditingProduct((prev) => ({ ...prev, images: [capturedBase64] }));
    } else {
      setFormData((prev) => ({ ...prev, image: capturedBase64 }));
    }

    stopLiveCamera();
  };

  // 🛑 3. STOP CAMERA STREAM
  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // 📁 4. FILE UPLOAD HANDLER (FROM PC DISK)
  const handleImageFile = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size must be under 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditingProduct((prev) => ({ ...prev, images: [reader.result] }));
      } else {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // 5. Upload Product Handler (Sends to Admin Approval queue)
  const handleUpload = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.storeName || !formData.storeAddress || !formData.storePhone) {
      alert('Please fill Product Title, Price, Store Name, Address and Contact Number!');
      return;
    }

    const newProd = {
      _id: 'prod-' + Date.now(),
      title: formData.title,
      price: Number(formData.price),
      woodType: formData.woodType,
      description: formData.description || 'Handcrafted timber item.',
      storeName: formData.storeName,
      storeAddress: formData.storeAddress,
      storePhone: formData.storePhone,
      images: [formData.image || 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80'],
      isApproved: false // ⏳ Sent to Admin quality check queue!
    };

    const updated = [newProd, ...products];
    saveProducts(updated);

    // Reset Form
    setFormData({
      title: '',
      price: '',
      woodType: 'Sheesham',
      description: '',
      storeName: '',
      storeAddress: '',
      storePhone: '',
      image: ''
    });

    alert('✅ Product submitted! Sent to Admin for quality check & approval.');
  };

  // 6. Delete Product Handler
  const handleDeleteProduct = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const updated = products.filter((p) => p._id !== id);
    saveProducts(updated);
    alert('Product deleted!');
  };

  // 7. Edit & Update Product Handler
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p._id === editingProduct._id ? editingProduct : p));
    saveProducts(updated);
    setEditingProduct(null);
    alert('Product updated successfully!');
  };

  // 8. Add Custom Order
  const handleAddOrder = (e) => {
    e.preventDefault();
    const newOrder = {
      _id: 'ord-' + Date.now(),
      orderId: 'ALY-' + Math.floor(1000 + Math.random() * 9000),
      productTitle: newOrderData.productTitle,
      price: Number(newOrderData.price),
      customerName: newOrderData.customerName,
      customerPhone: newOrderData.customerPhone,
      deliveryAddress: newOrderData.deliveryAddress,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: newOrderData.deliveryDate,
      status: newOrderData.status,
      courierPartner: 'BlueDart Air Express'
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);
    setShowAddOrderModal(false);
    setNewOrderData({
      productTitle: '',
      price: '',
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Crafting in Progress'
    });
    alert('Order created with delivery date!');
  };

  // 9. Update Delivery Date & Status
  const handleUpdateDeliveryDate = (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    const updated = orders.map((ord) => (ord._id === editingOrder._id ? editingOrder : ord));
    saveOrders(updated);
    setEditingOrder(null);
    alert(`Order ${editingOrder.orderId} delivery date updated!`);
  };

  // 10. Delete Order
  const handleDeleteOrder = (id) => {
    if (!window.confirm('Delete this order?')) return;
    const updated = orders.filter((o) => o._id !== id);
    saveOrders(updated);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#24211D] font-sans antialiased p-4 md:p-8">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#182119] flex items-center justify-center text-amber-200 text-xl font-serif font-black shadow">
            🪵
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#182119]">Artisan Studio Hub</h1>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Product Inventory & Live Camera Capture</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/admin" 
            className="bg-amber-100 hover:bg-amber-200 text-[#182119] px-3.5 py-2 rounded-xl text-xs font-bold border border-amber-300 transition"
          >
            🛡️ Admin Console
          </Link>
          <Link 
            href="/" 
            className="bg-[#182119] hover:bg-[#2A382C] text-amber-100 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow"
          >
            ← View Store
          </Link>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="max-w-6xl mx-auto mt-6 flex gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-[#182119] text-amber-100'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <span>🪵</span>
          <span>Artisan Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#182119] text-amber-100'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          <span>🚚</span>
          <span>Customer Orders & Deliveries ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY & UPLOAD */}
      {activeTab === 'inventory' && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          
          {/* Upload Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-serif font-bold text-[#182119] flex items-center gap-2 border-b border-stone-100 pb-3">
              <span>✨</span> Add New Wood Product
            </h2>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Store / Brand Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. AL-YALA Heritage Atelier" 
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#182119]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Store Contact / Phone No. *</label>
                <input 
                  type="tel" 
                  placeholder="e.g. +91 98765 43210" 
                  value={formData.storePhone}
                  onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#182119]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Store / Workshop Address *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Shop #14, Lakdi Mandi, Saharanpur, UP" 
                  value={formData.storeAddress}
                  onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#182119]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Product Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hand-Carved Teak Mirror" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#182119]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block uppercase">Price (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="499" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#182119]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block uppercase">Wood Type</label>
                  <select 
                    value={formData.woodType}
                    onChange={(e) => setFormData({ ...formData, woodType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none"
                  >
                    <option value="Sheesham">Sheesham</option>
                    <option value="Teak">Teak</option>
                    <option value="Oak">Oak</option>
                    <option value="Bamboo">Bamboo</option>
                    <option value="Reclaimed Pine">Reclaimed Pine</option>
                  </select>
                </div>
              </div>

              {/* 📷 Live Camera and File Upload Buttons */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Product Photo</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-2 rounded-xl text-xs font-bold border border-stone-300 cursor-pointer transition text-center">
                    <span>📁</span> Upload File
                    <input type="file" accept="image/*" onChange={(e) => handleImageFile(e, false)} className="hidden" />
                  </label>
                  
                  {/* Real Live Camera Button */}
                  <button
                    type="button"
                    onClick={() => startLiveCamera(false)}
                    className="flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-2 rounded-xl text-xs font-bold border border-amber-300 transition text-center shadow-sm"
                  >
                    <span>📸</span> Open Camera
                  </button>
                </div>

                {formData.image && (
                  <div className="relative mt-2 rounded-2xl overflow-hidden border border-stone-300 h-28 bg-stone-100 flex items-center justify-center">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-lg"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Description</label>
                <textarea 
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#182119] hover:bg-[#2A382C] text-amber-100 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow mt-2"
              >
                + Upload for Admin Review
              </button>
            </form>
          </div>

          {/* Product Inventory List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
              <h2 className="text-base font-serif font-bold text-[#182119] mb-4">
                📦 Your Artisan Inventory ({products.length})
              </h2>

              <div className="divide-y divide-stone-100">
                {products.map((item) => (
                  <div key={item._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.images?.[0]} alt={item.title} className="w-16 h-16 rounded-2xl object-cover border border-stone-200 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-amber-800 uppercase">🪵 {item.storeName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.isApproved !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {item.isApproved !== false ? '● Live' : '⏳ Pending Review'}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 mt-0.5">{item.title}</h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1">📍 {item.storeAddress}</p>
                        <p className="text-xs font-black text-[#182119] mt-0.5">₹{item.price} • {item.woodType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button onClick={() => setEditingProduct(item)} className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-300">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(item._id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-200">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ORDERS & DELIVERY SCHEDULE */}
      {activeTab === 'orders' && (
        <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#182119] flex items-center gap-2">
                <span>📦</span> Active Customer Orders & Delivery Dates
              </h2>
            </div>
            <button 
              onClick={() => setShowAddOrderModal(true)}
              className="bg-[#182119] hover:bg-[#2A382C] text-amber-100 px-4 py-2 rounded-xl text-xs font-bold shadow"
            >
              + Add Ordered Product
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {orders.map((ord) => (
              <div key={ord._id} className="py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-[#182119] text-amber-200 px-2.5 py-0.5 rounded">
                      {ord.orderId}
                    </span>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                      ● {ord.status}
                    </span>
                    <span className="text-xs font-black text-[#182119]">₹{ord.price}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">{ord.productTitle}</h4>
                  <p className="text-xs text-stone-600">Buyer: {ord.customerName} ({ord.customerPhone}) • 📍 {ord.deliveryAddress}</p>
                </div>

                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Scheduled Delivery</span>
                    <span className="font-bold text-xs text-[#182119]">{ord.deliveryDate}</span>
                  </div>
                  <button 
                    onClick={() => setEditingOrder(ord)} 
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-300"
                  >
                    ✏️ Update
                  </button>
                  <button 
                    onClick={() => handleDeleteOrder(ord._id)} 
                    className="bg-red-50 text-red-600 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📸 LIVE WEBCAM CAMERA MODAL POPUP */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 text-white rounded-[2.5rem] border border-stone-700 w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <h3 className="font-serif font-bold text-base text-amber-200">Live Webcam Photo Capture</h3>
              </div>
              <button 
                onClick={stopLiveCamera} 
                className="text-stone-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {cameraError ? (
              <div className="bg-red-950/80 border border-red-800 p-4 rounded-2xl text-xs text-red-200 text-center space-y-2">
                <p>{cameraError}</p>
                <p className="text-[11px] text-stone-400">Make sure your laptop webcam is enabled and browser has permission.</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-stone-700 shadow-inner">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={stopLiveCamera}
                className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 py-3 rounded-2xl text-xs font-bold transition"
              >
                Cancel
              </button>
              {!cameraError && (
                <button
                  type="button"
                  onClick={captureLivePhoto}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-stone-950 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>📸</span>
                  <span>Capture Photo</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* EDIT INVENTORY MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-300 w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#182119]">Edit Store Profile & Product</h3>
              <button onClick={() => setEditingProduct(null)} className="text-stone-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Store / Brand Name</label>
                <input 
                  type="text" 
                  value={editingProduct.storeName || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, storeName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Store Contact / Phone No.</label>
                <input 
                  type="tel" 
                  value={editingProduct.storePhone || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, storePhone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Product Title</label>
                <input 
                  type="text" 
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block uppercase">Price (₹)</label>
                  <input 
                    type="number" 
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block uppercase">Wood Type</label>
                  <select 
                    value={editingProduct.woodType || 'Sheesham'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, woodType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Sheesham">Sheesham</option>
                    <option value="Teak">Teak</option>
                    <option value="Oak">Oak</option>
                    <option value="Bamboo">Bamboo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Update Photo</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-2 rounded-xl text-xs font-bold border border-stone-300 cursor-pointer transition text-center">
                    <span>📁</span> File
                    <input type="file" accept="image/*" onChange={(e) => handleImageFile(e, true)} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => startLiveCamera(true)}
                    className="flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-2 rounded-xl text-xs font-bold border border-amber-300 transition text-center shadow-sm"
                  >
                    <span>📸</span> Camera
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-stone-200 py-2.5 rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#182119] text-amber-100 py-2.5 rounded-xl text-xs font-bold shadow">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE DELIVERY DATE MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-300 w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-base text-[#182119]">Update Delivery: {editingOrder.orderId}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-stone-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateDeliveryDate} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">📅 Scheduled Delivery Date</label>
                <input 
                  type="date" 
                  value={editingOrder.deliveryDate || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, deliveryDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Status</label>
                <select 
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="Crafting in Progress">🪵 Crafting in Progress</option>
                  <option value="Quality Checked & Crated">📦 Quality Checked & Crated</option>
                  <option value="Dispatched in Transit">🚚 Dispatched in Transit</option>
                  <option value="Delivered">✅ Delivered</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setEditingOrder(null)} className="flex-1 bg-stone-200 py-2.5 rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#182119] text-amber-100 py-2.5 rounded-xl text-xs font-bold shadow">
                  Update Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD ORDER MODAL */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-300 w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-base text-[#182119]">Add Custom Ordered Product</h3>
              <button onClick={() => setShowAddOrderModal(false)} className="text-stone-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddOrder} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Product Name *</label>
                <input 
                  type="text" 
                  value={newOrderData.productTitle}
                  onChange={(e) => setNewOrderData({ ...newOrderData, productTitle: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block uppercase">Price (₹) *</label>
                  <input 
                    type="number" 
                    value={newOrderData.price}
                    onChange={(e) => setNewOrderData({ ...newOrderData, price: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block uppercase">Delivery Date *</label>
                  <input 
                    type="date" 
                    value={newOrderData.deliveryDate}
                    onChange={(e) => setNewOrderData({ ...newOrderData, deliveryDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Customer Name *</label>
                <input 
                  type="text" 
                  value={newOrderData.customerName}
                  onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Customer Phone *</label>
                <input 
                  type="tel" 
                  value={newOrderData.customerPhone}
                  onChange={(e) => setNewOrderData({ ...newOrderData, customerPhone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block uppercase">Delivery Address *</label>
                <textarea 
                  rows="2"
                  value={newOrderData.deliveryAddress}
                  onChange={(e) => setNewOrderData({ ...newOrderData, deliveryAddress: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  required
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowAddOrderModal(false)} className="flex-1 bg-stone-200 py-2.5 rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#182119] text-amber-100 py-2.5 rounded-xl text-xs font-bold shadow">
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}