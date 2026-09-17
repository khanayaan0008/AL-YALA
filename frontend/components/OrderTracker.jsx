import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck } from 'lucide-react';

export default function OrderTracker({ orderStatus = 'Processing' }) {
  const stages = [
    { label: 'Order Placed', icon: Clock },
    { label: 'Processing', icon: CheckCircle2 },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: PackageCheck },
  ];

  const currentIdx = stages.findIndex(s => s.label.toLowerCase() === orderStatus.toLowerCase());

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 my-4 shadow-sm">
      <h3 className="font-semibold text-stone-800 text-sm mb-6">Delivery Progress</h3>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -translate-y-1/2 z-0" />
        {stages.map((stage, idx) => {
          const isCompleted = idx <= (currentIdx === -1 ? 1 : currentIdx);
          const Icon = stage.icon;
          return (
            <div key={stage.label} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isCompleted ? 'bg-[#2B3A29] text-white shadow' : 'bg-stone-200 text-stone-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-medium mt-2 max-w-[80px] text-center ${
                isCompleted ? 'text-stone-900 font-bold' : 'text-stone-400'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}