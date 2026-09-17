import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProductReviews from '../components/ProductReviews';
import AuthModal from '../components/AuthModal';

export default function BuyerStorefront() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(19);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Shopping Cart & Modals State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerState, setCustomerState] = useState('Maharashtra');
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const UPI_ID = 'rehman143@naviaxis';
  const BANK_NAME = 'Bank of Baroda';

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

  // Master Wood Art Catalog
  const defaultWoodArtworks = [
    {
      id: 1,
      title: 'Hand-Carved Royal Teakwood Wave Art',
      category: 'Master Sculptures',
      woodType: 'Burma Teakwood (Sagwan)',
      artisan: 'Ustad Vikram Sharma',
      sellerCity: 'Saharanpur, UP',
      price: 18500,
      originalPrice: 22000,
      rating: 4.9,
      reviewsCount: 38,
      tag: 'Bestseller',
      description: 'Single-piece 40-year aged Burma Teakwood log chiseled into organic fluid waves. Finished with 3 coats of organic beeswax.',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      status: 'Approved'
    },
    {
      id: 2,
      title: 'Ancient Floral Mandala Carved Wall Panel',
      category: 'Wall Decor',
      woodType: 'Indian Sheesham (Rosewood)',
      artisan: 'Master Rajesh Soni',
      sellerCity: 'Jaipur, Rajasthan',
      price: 24000,
      originalPrice: 28500,
      rating: 5.0,
      reviewsCount: 24,
      tag: 'Heritage Piece',
      description: 'Hand-carved concentric floral mandala with brass wire Tarkashi inlay work, depicting royal Rajasthani palace motifs.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      status: 'Approved'
    },
    {
      id: 3,
      title: 'Imperial Solid Teak Heritage Elephant Figurine',
      category: 'Figurines',
      woodType: 'Seasoned Teakwood',
      artisan: 'Farhan Woodworks',
      sellerCity: 'Jodhpur, Rajasthan',
      price: 12800,
      originalPrice: 15000,
      rating: 4.8,
      reviewsCount: 19,
      tag: 'Limited Edition',
      description: 'Solid seasoned teak carved with royal elephant tusks and ornate ceremonial saddle carvings.',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      status: 'Approved'
    },
    {
      id: 4,
      title: 'Organic Live-Edge Natural Teak Center Table',
      category: 'Luxury Furniture',
      woodType: '100-Yr Reclaimed Teak Root',
      artisan: 'Acharya Shankaran Pillai',
      sellerCity: 'Wayanad, Kerala',
      price: 45000,
      originalPrice: 52000,
      rating: 4.9,
      reviewsCount: 42,
      tag: 'Raw Edge',
      description: 'Preserved cross-section of aged timber root with natural burl grain patterns, leveled and sealed with waterproof teak oil.',
      image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80',
      status: 'Approved'
    },
    {
      id: 5,
      title: 'Hand-Turned Geometric Centerpiece Bowl',
      category: 'Dining & Decor',
      woodType: 'Organic Walnut Wood',
      artisan: 'Srinagar Craft Guild',
      sellerCity: 'Srinagar, Kashmir',
      price: 4200,
      originalPrice: 5500,
      rating: 4.7,
      reviewsCount: 56,
      tag: 'Hand-Turned',
      description: 'Lathe-turned single log of Kashmir walnut, perfect as a luxury fruit platter or centerpiece bowl.',
      image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
      status: 'Approved'
    },
    {
      id: 6,
      title: 'Royal Jharokha Carved Accent Mirror Frame',
      category: 'Wall Decor',
      woodType: 'Rosewood with Brass Inlay',
      artisan: 'Jaipur Heritage Guild',
      sellerCity: 'Jaipur, Rajasthan',
      price: 16500,
      originalPrice: 19800,
      rating: 4.9,
      reviewsCount: 31,
      tag: 'Jharokha Jaali',
      description: 'Traditional lattice (Jaali) doors opening to reveal a high-definition mirror frame, handcrafted from dark rosewood.',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
      status: 'Approved'
    },
  ];

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('alyala_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        const approved = parsed.filter((p) => p.status === 'Approved');
        setProducts(approved.length > 0 ? approved : defaultWoodArtworks);
      } else {
        setProducts(defaultWoodArtworks);
        localStorage.setItem('alyala_products', JSON.stringify(defaultWoodArtworks));
      }
    } catch (e) {
      setProducts(defaultWoodArtworks);
    }

    try {
      const savedCart = localStorage.getItem('alyala_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {}

    try {
      const savedUser = localStorage.getItem('alyala_current_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setCurrentUser(u);
        setCustomerName(u.name || '');
      }
    } catch (e) {}
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('alyala_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].qty += 1;
    } else {
      newCart.push({ ...product, qty: 1 });
    }

    updateCart(newCart);
    showToast(`✓ "${product.title}" added to cart!`);
  };

  const handleQtyChange = (id, delta) => {
    let newCart = cart.map((item) => {
      if (item.id === id) return { ...item, qty: item.qty + delta };
      return item;
    }).filter((item) => item.qty > 0);

    updateCart(newCart);
  };

  const handleBuyNow = (product, e) => {
    if (e) e.stopPropagation();
    setSelectedProduct(null);
    setIsCartOpen(false);
    setCheckoutData({
      items: [{ ...product, qty: 1 }],
      total: product.price
    });
  };

  const handleCartCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    setIsCartOpen(false);
    setCheckoutData({
      items: cart,
      total: total
    });
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim() || !customerCity.trim()) {
      alert('Please complete all shipping address fields.');
      return;
    }

    if (paymentMethod === 'ONLINE' && !transactionId.trim()) {
      alert('Please enter your UPI Transaction Ref / UTR number after completing payment.');
      return;
    }

    const newOrderId = `ALYALA-${Math.floor(1000 + Math.random() * 9000)}`;

    const lightweightItems = checkoutData.items.map((it) => ({
      id: it.id,
      title: it.title,
      price: it.price,
      qty: it.qty,
      image: it.image?.startsWith('data:')
        ? 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80'
        : it.image
    }));

    const orderDetails = {
      orderId: newOrderId,
      items: lightweightItems,
      totalAmount: checkoutData.total,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: `${customerAddress.trim()}, ${customerCity.trim()}, ${customerState} - India`,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === 'ONLINE' ? transactionId.trim() : 'N/A (Cash on Delivery)',
      orderDate: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    try {
      localStorage.setItem('last_order_id', newOrderId);
      localStorage.setItem(`order_${newOrderId}`, JSON.stringify(orderDetails));
    } catch (storageErr) {
      try {
        localStorage.removeItem('alyala_cart');
        localStorage.setItem('last_order_id', newOrderId);
        localStorage.setItem(`order_${newOrderId}`, JSON.stringify(orderDetails));
      } catch (e) {}
    }

    updateCart([]);
    setCheckoutData(null);
    setTransactionId('');
    setOrderConfirmed(orderDetails);
  };

  const handleLogout = () => {
    localStorage.removeItem('alyala_current_user');
    setCurrentUser(null);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const categories = ['All', 'Master Sculptures', 'Wall Decor', 'Luxury Furniture', 'Figurines', 'Dining & Decor'];
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1D1A16] font-sans antialiased selection:bg-amber-300/40 relative overflow-x-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#121B13] text-amber-200 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/30 flex items-center gap-2 animate-bounce">
          <span>🪵</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#121B13] text-[#EFE7D5] text-[11px] font-bold py-2.5 px-4 sm:px-6 shadow-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="tracking-[0.25em] uppercase font-serif text-[10px] text-amber-300 font-bold">
            ✦ AL-YALA DIRECT MASTER ARTISAN GUILD • PURE SEASONED TIMBER ✦
          </span>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-0.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-300 font-extrabold tracking-wider">
              {liveVisitors} Live Collectors Browsing
            </span>
          </div>
        </div>
      </div>

      {/* 2. FIXED NAVIGATION HEADER */}
      <header className="bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#E3DAC8] sticky top-0 z-40 shadow-[0_4px_25px_-10px_rgba(0,0,0,0.06)]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#121B13] to-[#1F2C20] flex items-center justify-center text-amber-200 text-xl shadow-lg border border-amber-900/30 group-hover:scale-105 transition-transform duration-300">
              🪵
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-[0.15em] text-[#121B13] block leading-none">
                AL-YALA
              </span>
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#7A6E5D] font-extrabold block mt-1">
                Artisan Woodcraft
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/seller" 
              className="bg-gradient-to-r from-[#121B13] to-[#253626] text-amber-100 px-4 py-2.5 rounded-2xl text-xs font-extrabold hover:brightness-110 transition shadow-lg flex items-center gap-1.5 border border-amber-900/30 tracking-wide"
            >
              <span>+</span> Sell Wood Art
            </Link>

            <Link href="/track" className="text-xs font-bold text-stone-800 hover:text-[#121B13] transition hidden sm:inline">
              🚚 Track Order
            </Link>

            <Link href="/admin" className="text-xs font-bold text-stone-600 hover:text-[#121B13] transition hidden sm:inline">
              ⚙ Admin Panel
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#EAE2D2] hover:bg-[#E0D6C3] border border-[#DBD0BD] px-4 py-2 rounded-2xl text-xs font-black text-[#121B13] shadow-sm transition hover:scale-105"
            >
              <span>🛒</span>
              <span>Cart</span>
              <span className="bg-[#121B13] text-amber-200 px-2 py-0.5 rounded-full text-[10px] ml-1">
                {totalCartCount}
              </span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-[#EAE2D2] border border-[#DBD0BD] py-1.5 px-3 rounded-2xl shadow-sm">
                <div className="w-7 h-7 rounded-full bg-[#121B13] text-amber-200 flex items-center justify-center font-black text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-black text-[#121B13]">{currentUser.name}</span>
                <button onClick={handleLogout} className="text-[10px] text-rose-600 hover:underline font-black ml-1">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-[#EAE2D2] hover:bg-[#E0D6C3] text-[#121B13] border border-[#DBD0BD] text-xs font-black px-4 py-2 rounded-2xl transition shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO HEADING BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="relative rounded-[36px] bg-gradient-to-br from-[#121B13] via-[#1A261B] to-[#0E150F] p-8 sm:p-14 text-center overflow-hidden shadow-[0_20px_50px_-15px_rgba(18,27,19,0.35)] border border-amber-500/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-amber-400/20 via-amber-300/5 to-transparent blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <div className="inline-block">
              <span className="text-[11px] tracking-[0.25em] font-black uppercase bg-[#28372A]/90 text-amber-300 px-5 py-2 rounded-full border border-amber-400/30 shadow-md">
                ✦ 100% SOLID SEASONED TIMBER & HAND-CHISELED ART ✦
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-[#FBF6EE] tracking-tight leading-[1.08] drop-shadow-md">
              Handcrafted <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">Wood Artworks</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#D1C7B7] font-semibold max-w-2xl mx-auto leading-relaxed pt-1">
              Direct from certified master woodcarvers across traditional workshops in India. Click on any piece to inspect grain, artisan details, or purchase online.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY PILL SELECTOR */}
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-2.5 overflow-x-auto py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-[#121B13] text-amber-200 shadow-lg scale-105 border border-amber-500/30'
                : 'bg-white text-[#4A3E31] border border-[#E3DAC8] hover:bg-[#EFE7D8] shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 5. PRODUCT GALLERY GRID */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-16">
        <section id="catalog" className="space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 border-b border-[#E3DAC8] pb-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#85541A]">
                Curated Artisan Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#121B13] mt-0.5">
                Live Wood Artworks Gallery
              </h2>
            </div>
            <p className="text-xs text-[#7A6E5D] font-extrabold">
              Showing {filteredProducts.length} verified authentic pieces
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="bg-white rounded-3xl border border-[#E3DAC8] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_18px_45px_rgba(18,27,19,0.14)] hover:border-amber-900/40 transition-all duration-500 flex flex-col justify-between group cursor-pointer"
              >
                <div className="relative h-72 w-full bg-[#EAE2D2] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <span className="absolute top-3 left-3 bg-[#121B13]/90 backdrop-blur-md text-amber-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/10 shadow-md">
                    {item.tag || 'Solid Teak'}
                  </span>
                  
                  {item.woodType && (
                    <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#121B13] text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md border border-[#DBD0BD]">
                      🪵 {item.woodType}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[11px] text-[#7A6E5D] mb-1.5 font-bold">
                      <span>{item.category}</span>
                      <span className="text-amber-600 font-black flex items-center gap-1">
                        ★ {item.rating || 5.0} <span className="text-stone-400 font-bold">({item.reviewsCount || 20})</span>
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-lg text-[#121B13] group-hover:text-[#85541A] transition leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#6B5F4E] font-bold mt-1.5">
                      By <span className="font-black text-[#121B13]">{item.artisan}</span> • 📍 {item.sellerCity || 'India'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EFE8DA] space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-serif font-black text-[#121B13]">
                          ₹{Number(item.price).toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-[#9E907C] line-through ml-2 font-bold">
                            ₹{Number(item.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        In Stock
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="bg-[#EAE2D2] hover:bg-[#DDD2BF] text-[#121B13] text-xs font-black py-2.5 rounded-xl border border-[#DBD0BD] transition shadow-sm"
                      >
                        + Add to Cart
                      </button>

                      <button
                        onClick={(e) => handleBuyNow(item, e)}
                        className="bg-[#121B13] hover:bg-[#223324] text-amber-200 text-xs font-black py-2.5 rounded-xl shadow-md transition hover:scale-[1.02]"
                      >
                        ⚡ Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E3DAC8] shadow-sm">
          <ProductReviews />
        </section>

      </main>

      {/* 6. PRODUCT QUICK VIEW MODAL (WITH RED CLOSE BUTTON) */}
      {selectedProduct && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* RED CROSS CANCEL BUTTON */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-black text-sm shadow-md transition hover:scale-110 active:scale-95 z-10"
              title="Close"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-64 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  {selectedProduct.category}
                </span>

                <h3 className="font-serif font-black text-xl text-[#121B13] leading-tight">
                  {selectedProduct.title}
                </h3>

                <p className="text-xs text-stone-600 font-semibold">
                  Timber: <span className="font-bold text-[#121B13]">{selectedProduct.woodType || 'Burma Teak'}</span>
                </p>

                <p className="text-xs text-stone-500 leading-relaxed">
                  {selectedProduct.description || 'Master artisan carved heirloom solid wood artwork.'}
                </p>

                <div className="pt-2">
                  <span className="text-2xl font-serif font-black text-[#121B13]">
                    ₹{Number(selectedProduct.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                    className="bg-[#EAE2D2] text-[#121B13] py-3 rounded-xl font-black text-xs border border-[#DBD0BD]"
                  >
                    + Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="bg-[#121B13] text-amber-200 py-3 rounded-xl font-black text-xs shadow-md"
                  >
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. SLIDE-OUT SHOPPING CART DRAWER (WITH RED CLOSE BUTTON) */}
      {isCartOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsCartOpen(false); }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
        >
          <div className="bg-[#FAF7F2] w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#E3DAC8] animate-in slide-in-from-right duration-300">
            
            <div className="flex justify-between items-center border-b border-[#E3DAC8] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <h3 className="font-serif font-black text-lg text-[#121B13]">Your Artisan Cart</h3>
                <span className="bg-[#121B13] text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalCartCount} items
                </span>
              </div>
              
              {/* RED CROSS BUTTON */}
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-black text-xs shadow transition hover:scale-105"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <span className="text-4xl">🪵</span>
                  <p className="font-serif font-bold text-stone-700">Your cart is empty</p>
                  <p className="text-xs text-stone-400">Discover hand-chiseled teakwood art in the gallery</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#E3DAC8] flex gap-3 items-center shadow-sm">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover border" />
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-xs text-[#121B13] line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] font-bold text-amber-800 mt-0.5">₹{Number(item.price).toLocaleString('en-IN')}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 font-black text-xs flex items-center justify-center hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="text-xs font-black">{item.qty}</span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-stone-100 font-black text-xs flex items-center justify-center hover:bg-stone-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#E3DAC8] pt-4 space-y-3">
                <div className="flex justify-between items-center text-sm font-black text-[#121B13]">
                  <span>Subtotal:</span>
                  <span className="text-xl font-serif">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={handleCartCheckout}
                  className="w-full bg-[#121B13] hover:bg-[#223324] text-amber-200 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase transition shadow-lg"
                >
                  Proceed to Checkout ➔
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 8. QUICK CHECKOUT MODAL (WITH STICKY RED CROSS CANCEL BUTTON) */}
      {checkoutData && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setCheckoutData(null); }}
          className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
            
            {/* STICKY TOP HEADER WITH PROMINENT RED CROSS BUTTON */}
            <div className="bg-[#FAF7F2] p-5 sm:p-6 border-b border-stone-200 flex justify-between items-center sticky top-0 z-30 shadow-sm">
              <div>
                <h3 className="font-serif font-black text-xl text-[#121B13]">Complete Your Order</h3>
                <p className="text-[11px] text-stone-500 font-semibold">White-glove courier shipping across India</p>
              </div>

              {/* RED CROSS CANCEL BUTTON */}
              <button
                type="button"
                onClick={() => setCheckoutData(null)}
                className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full w-9 h-9 flex items-center justify-center font-black text-sm shadow-md transition hover:scale-110"
                title="Cancel and Close"
              >
                ✕
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              
              {/* Order Items Summary */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <span className="font-bold text-stone-500 uppercase text-[10px]">Order Summary</span>
                {checkoutData.items.map((it) => (
                  <div key={it.id} className="flex justify-between font-bold text-stone-800">
                    <span>{it.qty}× {it.title}</span>
                    <span>₹{(it.price * it.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t border-stone-200 pt-2 flex justify-between font-black text-sm text-[#121B13]">
                  <span>Total Payable:</span>
                  <span className="text-emerald-800 font-serif text-lg">₹{checkoutData.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Collector Full Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Abdul Mannam"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#121B13]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 98200 12345"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#121B13]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">City / District *</label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="e.g. Mumbai / Pune"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#121B13]"
                    />
                  </div>
                </div>

                {/* ALL INDIAN STATES & UNION TERRITORIES */}
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Select State / Union Territory *</label>
                  <select
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800 focus:outline-[#121B13]"
                  >
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Complete Doorstep Address (with Pin Code) *</label>
                  <textarea
                    rows="2"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Flat/House No, Building, Landmark, Pin Code (e.g. 400050)"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-[#121B13]"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Select Payment Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ONLINE')}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition ${
                        paymentMethod === 'ONLINE'
                          ? 'bg-[#121B13] text-amber-200 border-[#121B13] shadow-sm'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      ⚡ Scan QR / UPI Payment
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition ${
                        paymentMethod === 'COD'
                          ? 'bg-[#121B13] text-amber-200 border-[#121B13] shadow-sm'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      💵 Cash on Delivery
                    </button>
                  </div>
                </div>

                {/* QR CODE SECTION */}
                {paymentMethod === 'ONLINE' && (
                  <div className="bg-[#FAF7F2] p-5 rounded-2xl border-2 border-dashed border-[#DBD0BD] text-center space-y-3">
                    <div className="inline-block bg-white p-3 rounded-2xl border border-stone-200 shadow-md">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${UPI_ID}%26pn=AL-YALA%20Artisan%26am=${checkoutData.total}%26cu=INR`}
                        alt="UPI Payment QR Code"
                        className="w-40 h-40 mx-auto object-contain"
                      />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-stone-500">Scan & Pay via any UPI App (GPay / PhonePe / Paytm / BHIM)</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono font-black text-xs text-[#121B13] bg-white px-3 py-1 rounded-lg border border-stone-200">
                          {UPI_ID}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="bg-[#121B13] text-amber-200 px-2.5 py-1 rounded-lg font-bold text-[10px] hover:bg-[#223324]"
                        >
                          {copiedUpi ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-400 font-semibold">Bank: {BANK_NAME}</p>
                    </div>

                    <div className="pt-2 text-left">
                      <label className="font-bold text-stone-700 block mb-1">
                        Enter UPI Ref / Transaction UTR No. *
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 423984729103"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white font-mono text-xs focus:outline-[#121B13]"
                      />
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-[#121B13] hover:bg-[#223324] text-amber-200 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-xl"
                  >
                    Confirm & Place Artwork Order
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutData(null)}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2.5 rounded-2xl font-bold text-xs transition"
                  >
                    ✕ Cancel Order & Return to Store
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      )}

      {/* 9. ORDER CONFIRMATION SUCCESS MODAL */}
      {orderConfirmed && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-stone-200 shadow-2xl text-center space-y-4 relative">
            
            {/* Top Red Cross */}
            <button
              onClick={() => setOrderConfirmed(null)}
              className="absolute top-4 right-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-black text-xs shadow"
            >
              ✕
            </button>

            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✓
            </div>
            
            <h3 className="font-serif font-black text-2xl text-[#121B13]">
              Order Placed Successfully!
            </h3>
            
            <p className="text-xs text-stone-500">
              Thank you, <span className="font-bold text-[#121B13]">{orderConfirmed.customerName}</span>. Your handcrafted piece is being prepared for crate dispatch.
            </p>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 font-mono text-xs">
              <span className="text-stone-400 block text-[10px]">YOUR TRACKING WAYBILL ID:</span>
              <span className="text-lg font-black text-emerald-800">{orderConfirmed.orderId}</span>
            </div>

            <div className="pt-3 space-y-2">
              <Link
                href="/track"
                className="block w-full bg-[#121B13] hover:bg-[#223324] text-amber-200 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-lg"
              >
                🚚 Track Order Live on Radar
              </Link>
              
              <button
                onClick={() => setOrderConfirmed(null)}
                className="text-xs text-stone-500 hover:text-stone-800 font-bold tracking-wide"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#121B13] text-[#EFE7D5] py-12 px-6 mt-20 border-t border-amber-950/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div>
            <span className="text-2xl font-serif font-black tracking-widest text-amber-200 block">AL-YALA</span>
            <p className="text-xs text-stone-400 font-bold mt-1">Master Artisan Woodcrafts & Heritage Timber Atelier</p>
          </div>
          <p className="text-xs text-stone-400 font-bold">© {new Date().getFullYear()} AL-YALA Atelier. All Rights Reserved.</p>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

    </div>
  );
}