import React, { useState, useEffect } from 'react';
import StoreFront from '../components/StoreFront';
import OrderTracker from '../components/OrderTracker';
import { MapPin } from 'lucide-react';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/checkout/my-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    };
    fetchOrders();
  }, []);

  return (
    <StoreFront>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Your Handcrafted Purchases</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-400">
            No active woodcraft orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-stone-100 pb-3">
                <span className="text-stone-500">Order ID: <b className="text-stone-800">{order._id}</b></span>
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                  Total: ₹{order.totalAmount}
                </span>
              </div>

              <OrderTracker orderStatus={order.orderStatus} />

              <div className="flex items-center gap-2 text-xs text-stone-500">
                <MapPin className="w-4 h-4 text-emerald-800" />
                <span>Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city} ({order.shippingAddress.pincode})</span>
              </div>
            </div>
          ))
        )}
      </div>
    </StoreFront>
  );
}