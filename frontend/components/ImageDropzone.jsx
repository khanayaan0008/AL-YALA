import React, { useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, X } from 'lucide-react';

export default function ImageDropzone({ onImageUploaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "woodcraft_unsigned";

  const handleUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onImageUploaded(data.secure_url);
      }
    } catch (err) {
      alert("Image upload failed. Please check credentials.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-stone-600 mb-1">Product Photograph</label>
      {preview ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-300">
          <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-emerald-900/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cloud Uploaded
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition cursor-pointer ${
            isDragging ? 'border-emerald-600 bg-emerald-50' : 'border-stone-300 bg-stone-50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="imageFileInput"
            disabled={isUploading}
            onChange={(e) => handleUpload(e.target.files[0])}
          />
          <label htmlFor="imageFileInput" className="cursor-pointer flex flex-col items-center">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mb-2" />
                <span className="text-xs text-stone-500 font-medium">Uploading to cloud storage...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-stone-400 mb-1" />
                <span className="text-sm font-medium text-stone-700 underline">Upload Timber Asset</span>
                <span className="text-xs text-stone-400 mt-1">PNG, JPG, or WEBP</span>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
}