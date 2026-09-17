import React, { useState } from 'react';
import { X, PlusCircle, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

// 1. Define the base API URL dynamically
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AddProductModal({ isOpen, onClose, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    woodType: 'Sheesham',
    stock: 1,
  });

  const [uploadMode, setUploadMode] = useState('file');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const defaultImages = {
    Sheesham: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    Teak: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
    Bamboo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    'Reclaimed Pine': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    Oak: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const finalImage = imagePreview.trim() || defaultImages[formData.woodType] || defaultImages.Sheesham;

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          woodType: formData.woodType,
          stock: Number(formData.stock) || 1,
          images: [finalImage]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-stone-200 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b border-stone-100 z-10">
          <h2 className="text-xl font-serif font-bold text-stone-900">List Artisan Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Product Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Handcrafted Solid Teak Coffee Table"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Price (₹)</label>
              <input 
                type="number" 
                required 
                placeholder="2499"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Timber Material</label>
              <select 
                value={formData.woodType}
                onChange={(e) => setFormData({...formData, woodType: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
              >
                <option value="Sheesham">Sheesham</option>
                <option value="Teak">Teak</option>
                <option value="Bamboo">Bamboo</option>
                <option value="Reclaimed Pine">Reclaimed Pine</option>
                <option value="Oak">Oak</option>
              </select>
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-stone-700">Product Image</span>
              
              <div className="flex bg-stone-200 p-0.5 rounded-lg text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => { setUploadMode('file'); setImagePreview(''); }}
                  className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                    uploadMode === 'file' ? 'bg-white shadow text-stone-900' : 'text-stone-500'
                  }`}
                >
                  <Upload className="w-3 h-3" /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setUploadMode('url'); setImagePreview(''); }}
                  className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                    uploadMode === 'url' ? 'bg-white shadow text-stone-900' : 'text-stone-500'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" /> Image Link
                </button>
              </div>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2B3A29] file:text-white hover:file:bg-emerald-950 cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input 
                  type="url" 
                  placeholder="Paste image link (https://...)"
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-[#2B3A29]"
                />
              </div>
            )}

            {imagePreview && (
              <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-emerald-300 bg-white">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black text-white rounded-full transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Description</label>
            <textarea 
              rows={2} 
              required 
              placeholder="Detail dimensions, finishing oil, and wood texture..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-[#2B3A29]"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2B3A29] hover:bg-emerald-950 text-white font-medium py-3 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow"
            >
              <PlusCircle className="w-4 h-4" /> {loading ? 'Listing Product...' : 'Submit for Admin Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}