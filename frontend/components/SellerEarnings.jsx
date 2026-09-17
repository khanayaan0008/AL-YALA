import React from 'react';
import { DollarSign, Clock, Percent } from 'lucide-react';

export default function SellerEarnings({ wallet, transactions }) {
  return (
    <div className="p-6 bg-[#FDFBF7] rounded-3xl border border-[#ECE5D8] space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs font-semibold">
            <span>Available Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-stone-900">₹{wallet?.availableBalance || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs font-semibold">
            <span>Pending Balance</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-stone-900">₹{wallet?.pendingBalance || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-1 text-xs font-semibold">
            <span>Platform Cut</span>
            <Percent className="w-4 h-4 text-stone-600" />
          </div>
          <p className="text-2xl font-bold text-stone-900">10%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-stone-100 font-semibold text-sm text-stone-800">
          Payout Ledger
        </div>
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="bg-stone-50 text-xs font-semibold text-stone-500 border-b border-stone-100">
            <tr>
              <th className="p-3.5">Gross Amount</th>
              <th className="p-3.5">Platform Fee (10%)</th>
              <th className="p-3.5">Net Payout</th>
              <th className="p-3.5">Settlement Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {transactions?.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-stone-50/50">
                  <td className="p-3.5 font-medium text-stone-800">₹{tx.totalItemPrice}</td>
                  <td className="p-3.5 text-red-600">-₹{tx.platformCut}</td>
                  <td className="p-3.5 text-emerald-800 font-bold">₹{tx.sellerNetEarning}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-xs text-stone-400">No payout records generated yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}