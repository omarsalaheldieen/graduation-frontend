import React from 'react';

export default function ProductSpecification({ product }) {
  return (
    <div className="max-w-7xl w-full bg-cream shadow-lg rounded-3xl p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-oranges font-marker mb-6">
        Product Specifications
      </h1>

      <div className="overflow-x-auto">
        {/* Table for sm+ */}
        <table className="hidden sm:table table-auto w-full text-left text-[#333]">
          <thead>
            <tr className="bg-peach/30">
              <th className="px-4 py-3 text-base sm:text-lg font-semibold text-primary">Specification</th>
              <th className="px-4 py-3 text-base sm:text-lg font-semibold text-primary">Details</th>
            </tr>
          </thead>
          <tbody>
            <SpecRow label="Category" value={product.category} />
            <SpecRow label="Height" value={`${product.height ?? '-'} cm`} />
            <SpecRow label="Weight" value={`${product.weight ?? '-'} kg`} />
            <SpecRow label="Depth" value={`${product.depth ?? '-'} cm`} />
            <SpecRow label="Width" value={`${product.width ?? '-'} cm`} />
            <SpecRow label="Model Number" value={product.sku} />
          </tbody>
        </table>

        {/* Mobile-friendly stacked view */}
        <div className="sm:hidden space-y-4">
          <SpecCard label="Category" value={product.category} />
          <SpecCard label="Height" value={`${product.height ?? '-'} cm`} />
          <SpecCard label="Weight" value={`${product.weight ?? '-'} kg`} />
          <SpecCard label="Depth" value={`${product.depth ?? '-'} cm`} />
          <SpecCard label="Width" value={`${product.width ?? '-'} cm`} />
          <SpecCard label="Model Number" value={product.sku} />
        </div>

        {/* Reviews */}
        <div className="mt-6 shadow-lg p-4 sm:p-8 bg-cream rounded-2xl">
          <h3 className="text-xl sm:text-2xl font-semibold text-oranges font-marker mb-6">
            Customer Reviews
          </h3>
          {product.reviews?.length > 0 ? (
            <div className="space-y-6 mt-4">
              {product.reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-oranges mt-6">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }) {
  return (
    <tr className="border-b hover:bg-peach/10 transition">
      <td className="px-4 py-3 font-medium text-oranges">{label}</td>
      <td className="px-4 py-3 text-peach">{value}</td>
    </tr>
  );
}

function SpecCard({ label, value }) {
  return (
    <div className="bg-cream rounded-xl shadow p-4 flex justify-between items-center">
      <span className="font-medium text-oranges">{label}</span>
      <span className="text-peach">{value}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const fullStars = Math.floor(review.rating || 0);
  const halfStar = review.rating % 1 >= 0.5;

  return (
    <div className="bg-cream p-4 sm:p-6 shadow-xl rounded-xl space-y-4 sm:space-y-6 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-primary flex items-center justify-center">
          <span className="text-white font-semibold text-lg sm:text-xl">
            {review.reviewerName?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {[...Array(5)].map((_, i) =>
            i < fullStars ? <Star key={i} filled /> :
            i === fullStars && halfStar ? <HalfStar key={i} /> :
            <Star key={i} />
          )}
        </div>
      </div>
      <p className="text-base sm:text-lg text-oranges capitalize font-marker">{review.comment}</p>
      <div className="text-sm text-gray-500 space-y-1">
        <p className='text-oranges'>Reviewed by: <span className="font-semibold text-peach">{review.reviewerName}</span></p>
        <p className='text-oranges'>Email: <span className="font-semibold text-peach">{review.reviewerEmail}</span></p>
        <p className='text-oranges'>Date: <span className="font-semibold text-peach">{new Date(review.date).toLocaleDateString()}</span></p>
      </div>
    </div>
  );
}

function Star({ filled = false }) {
  return (
    <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${filled ? 'text-oranges' : 'text-peach'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.912c.969 0 1.371 1.24.588 1.81l-3.976 2.89 1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.976 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674-3.976-2.89c-.783-.57-.38-1.81.588-1.81h4.912L9.05 2.927z" />
    </svg>
  );
}

function HalfStar() {
  return (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-oranges" fill="currentColor" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="lightgray" />
        </linearGradient>
      </defs>
      <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.912c.969 0 1.371 1.24.588 1.81l-3.976 2.89 1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.976 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674-3.976-2.89c-.783-.57-.38-1.81.588-1.81h4.912L9.05 2.927z" />
    </svg>
  );
}
