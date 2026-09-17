import React, { useState, useRef, useEffect } from 'react';

export default function Product360Viewer() {
  const [images, setImages] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const fileInputRef = useRef(null);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);

  // Handle direct photo selection from device
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Numerical sort for frame orders (e.g. frame-1, frame-2)
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    const uploadedUrls = files.map((file) => URL.createObjectURL(file));
    setImages(uploadedUrls);
    setCurrentFrame(0);
    setIsAutoRotating(false);
  };

  // Drag interaction
  const handleMouseDown = (e) => {
    if (images.length === 0) return;
    setIsDragging(true);
    startXRef.current = e.clientX || e.touches?.[0]?.clientX;
    startFrameRef.current = currentFrame;
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || images.length === 0) return;
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const diffX = clientX - startXRef.current;
    
    // Sensitivity: 15px drag = next frame
    const frameOffset = Math.floor(diffX / 15);
    let newFrame = (startFrameRef.current - frameOffset) % images.length;
    if (newFrame < 0) newFrame += images.length;
    
    setCurrentFrame(newFrame);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto rotation
  useEffect(() => {
    let interval;
    if (isAutoRotating && images.length > 0) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % images.length);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating, images.length]);

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="w-full max-w-xl bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-sm">
        
        {/* Header & Controls */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div>
            <span className="text-[10px] tracking-widest font-bold uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
              {images.length > 0 ? `360° View (${images.length} Frames)` : '360° Interactive View'}
            </span>
            <h3 className="font-serif font-bold text-lg text-[#182119] mt-1">
              Handcrafted Product Showcase
            </h3>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            className="hidden"
          />

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-[#182119] hover:bg-[#2A382C] text-amber-50 text-xs font-semibold px-4 py-2.5 rounded-2xl transition shadow flex items-center gap-2"
          >
            <span>📸</span>
            {images.length > 0 ? 'Change 360 Photos' : 'Upload 360 Photos'}
          </button>
        </div>

        {/* 360 Viewer Box */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="relative w-full h-80 bg-white rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-inner"
        >
          {images.length > 0 ? (
            <>
              <img
                src={images[currentFrame]}
                alt={`Angle ${currentFrame + 1}`}
                className="w-full h-full object-contain pointer-events-none p-4"
                draggable={false}
              />
              <div className="absolute bottom-3 bg-[#182119]/80 backdrop-blur-sm text-white px-3.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow">
                <span>⇄</span> Drag left or right to rotate
              </div>
            </>
          ) : (
            /* Clean Empty State when no photos are uploaded */
            <div 
              onClick={() => fileInputRef.current.click()}
              className="text-center p-6 cursor-pointer hover:opacity-80 transition space-y-2"
            >
              <div className="w-14 h-14 mx-auto bg-amber-50 text-[#182119] rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-amber-100">
                🪵
              </div>
              <h4 className="font-serif font-bold text-sm text-[#182119]">No 360° Photos Uploaded</h4>
              <p className="text-xs text-stone-400 max-w-xs">
                Click <span className="font-semibold text-[#182119] underline">here</span> or use the button above to upload all angle photos of your artwork.
              </p>
            </div>
          )}
        </div>

        {/* Slider & Actions (Only visible after uploading) */}
        {images.length > 0 && (
          <div className="mt-5 space-y-3">
            <input
              type="range"
              min="0"
              max={images.length - 1}
              value={currentFrame}
              onChange={(e) => setCurrentFrame(Number(e.target.value))}
              className="w-full accent-[#182119] cursor-pointer"
            />

            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl border transition ${
                  isAutoRotating
                    ? 'bg-[#182119] text-white border-[#182119]'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {isAutoRotating ? '⏸ Pause Spin' : '▶ Auto 360° Spin'}
              </button>

              <span className="text-xs font-mono text-stone-500 font-semibold">
                Angle: {Math.round((currentFrame / images.length) * 360)}° (Frame {currentFrame + 1}/{images.length})
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}