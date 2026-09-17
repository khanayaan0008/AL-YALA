import React, { useState } from 'react';

export default function ProductReviews() {
  // Pre-loaded customer reviews
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Abdul Mannam',
      rating: 5,
      title: 'Masterpiece Craftsmanship!',
      comment: 'The teakwood finish and 3D wave carving exceeded all expectations. Looks breathtaking in my living room.',
      date: 'Aug 24, 2026',
      verified: true,
    },
    {
      id: 2,
      name: 'Rohan Deshmukh',
      rating: 5,
      title: 'Heavy, solid & authentic aroma',
      comment: 'You can smell the natural beeswax and raw wood polish right out of the crate. Superb white-glove packaging.',
      date: 'Aug 18, 2026',
      verified: true,
    },
    {
      id: 3,
      name: 'Priya Sundaram',
      rating: 4,
      title: 'Stunning organic wood grain',
      comment: 'A bit heavier than I thought, but the natural grain pattern is one of a kind. Truly artisanal.',
      date: 'Aug 10, 2026',
      verified: false,
    },
  ]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Calculate average rating
  const avgRating = (
    reviews.reduce((acc, item) => acc + item.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  // Form submit handler
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Please fill out your name and review details.');
      return;
    }

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      rating: Number(rating),
      title: title.trim() || 'Verified Purchase Review',
      comment: comment.trim(),
      date: 'Just now',
      verified: true,
    };

    // Add new review at top
    setReviews([newReview, ...reviews]);

    // Reset form
    setName('');
    setTitle('');
    setComment('');
    setRating(5);
    setIsFormOpen(false);
    setSubmittedMessage(true);

    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Rating Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-200 pb-6">
        <div>
          <span className="text-[10px] tracking-widest font-bold uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
            Client Testimonials
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#182119] mt-2">
            Collector Reviews & Ratings
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real feedback from verified handcrafted art collectors
          </p>
        </div>

        {/* Big Rating Badge & Write Review Button */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-serif font-bold text-[#182119]">{avgRating}</span>
            <div>
              <div className="flex text-amber-500 text-sm">
                {'★'.repeat(Math.round(avgRating))}
                {'☆'.repeat(5 - Math.round(avgRating))}
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                Based on {reviews.length} reviews
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-[#182119] hover:bg-[#2A382C] text-amber-50 text-xs font-semibold px-5 py-3 rounded-2xl transition shadow"
          >
            {isFormOpen ? '✕ Close Form' : '✍ Write a Review'}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {submittedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <span>✓</span> Thank you! Your review has been published successfully.
        </div>
      )}

      {/* 2. Review Submission Form (Dropdown / Expandable) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-stone-50 border border-stone-200 p-6 rounded-3xl space-y-4 transition-all"
        >
          <h3 className="font-serif font-bold text-base text-[#182119]">
            Share Your Experience
          </h3>

          {/* Interactive Star Picker */}
          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">
              Your Overall Rating *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition transform hover:scale-125 focus:outline-none"
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? 'text-amber-500'
                        : 'text-stone-300'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
              <span className="text-xs font-semibold text-stone-500 ml-2">
                {hoverRating || rating} out of 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Zaid Khan"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-[#182119]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Magnificent Wood Finish!"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-[#182119]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">
              Detailed Review *
            </label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other art lovers about the wood grain, weight, detailing, and delivery quality..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-[#182119]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#182119] hover:bg-[#2A382C] text-amber-100 text-xs font-semibold px-6 py-3 rounded-xl uppercase tracking-wider transition shadow"
          >
            Submit Feedback
          </button>
        </form>
      )}

      {/* 3. Customer Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-2.5 hover:border-stone-300 transition"
          >
            {/* Reviewer Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#182119] text-amber-200 flex items-center justify-center font-bold text-xs">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#182119]">{rev.name}</span>
                    {rev.verified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400">{rev.date}</span>
                </div>
              </div>

              {/* Star Rating Display */}
              <div className="flex text-amber-500 text-sm">
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>
            </div>

            {/* Title & Comment */}
            <div>
              <h4 className="text-xs font-bold text-stone-800">{rev.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">
                {rev.comment}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}