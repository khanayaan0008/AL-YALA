import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchFilterBar({ 
  searchQuery, 
  setSearchQuery, 
  selectedWood, 
  setSelectedWood, 
  priceRange, 
  setPriceRange, 
  sortBy, 
  setSortBy 
}) {
  const woodTypes = ['All', 'Teak', 'Sheesham', 'Bamboo', 'Reclaimed Pine', 'Oak'];

  return (
    <div className="bg-white border border-[#ECE5D8] rounded-2xl p-4 mb-8 shadow-sm space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
        <input 
          type="text" 
          placeholder="Search handcrafted tables, lamps, wall mirrors..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29] bg-stone-50/50"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Timber Material:
          </span>
          {woodTypes.map((wood) => (
            <button
              key={wood}
              onClick={() => setSelectedWood(wood)}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                selectedWood === wood 
                  ? 'bg-[#2B3A29] text-white shadow-sm' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {wood}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Max:</span>
            <input 
              type="range" 
              min="500" 
              max="50000" 
              step="500" 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)} 
              className="accent-[#2B3A29] w-24"
            />
            <span className="font-bold text-stone-800">₹{priceRange}</span>
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-stone-200 rounded-lg text-stone-700 bg-white"
          >
            <option value="popular">Latest First</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}