import React, { useState } from 'react';
import { CreditCard, MapPin, X } from 'lucide-react';

export default function CheckoutModal({ product, isOpen, onClose, onPaymentSuccess }) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    pincode: '',
    phone: ''
  });

  if (!isOpen || !product) return null;

  const handleRazorpay = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/checkout/create-order', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: product.price })
    });
    const { order } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourKeyHere",
      amount: order.amount,
      currency: "INR",
      name: "AURA WOOD CRAFT",
      description: product.title,
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await fetch('http://localhost:5000/api/checkout/verify-payment', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            items: [product],
            shippingAddress: address
          })
        });
        if (verifyRes.ok) {
          onPaymentSuccess();
          onClose();
        }
      },
      theme: { color: "#2B3A29" }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif font-bold text-stone-900">Secure Checkout</h2>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="bg-stone-50 p-3 rounded-xl mb-4 flex items-center gap-3 border border-stone-100">
          <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm line-clamp-1">{product.title}</h4>
            <p className="text-stone-500 text-xs">Total: ₹{product.price}</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
            <MapPin className="w-4 h-4 text-emerald-800" /> Shipping Destination
          </div>
          <input 
            type="text" 
            placeholder="Street / House Address" 
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]" 
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text" 
              placeholder="City" 
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]" 
            />
            <input 
              type="text" 
              placeholder="Pincode" 
              value={address.pincode}
              onChange={(e) => setAddress({...address, pincode: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]" 
            />
          </div>
          <input 
            type="tel" 
            placeholder="Contact Phone Number" 
            value={address.phone}
            onChange={(e) => setAddress({...address, phone: e.target.value})}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]" 
          />
        </div>

        <button 
          onClick={handleRazorpay}
          className="w-full bg-[#2B3A29] hover:bg-emerald-950 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 shadow"
        >
          <CreditCard className="w-4 h-4" /> Pay ₹{product.price} via Razorpay
        </button>
      </div>
    </div>
  );
}