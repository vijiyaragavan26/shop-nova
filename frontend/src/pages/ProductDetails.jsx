import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Star,
  Plus,
  Minus,
  MessageSquare,
  ArrowLeft,
  Share2
} from 'lucide-react';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProductById(id);
        setProduct(res.data.product);
        setSelectedImage(res.data.product.images?.[0] || '');
        setRelatedProducts(res.data.relatedProducts || []);

        // Fetch reviews
        const revRes = await reviewAPI.getProductReviews(res.data.product._id);
        setReviews(revRes.data.reviews || []);
      } catch (err) {
        console.error('Failed to load product:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for may have been removed or is unavailable.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const discountPercent =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    const res = await addToCart(product, quantity);
    if (res.success) {
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'info');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to write a customer review', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      addToast('Please provide your review feedback', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewAPI.createReview({
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      addToast(res.data.message, 'success');
      setReviews([res.data.review, ...reviews]);
      setShowReviewModal(false);
      setReviewComment('');
      setReviewTitle('');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 hover:text-blue-600 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center space-x-2">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-slate-900">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm p-4">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-contain object-center transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-blue-600 ring-2 ring-blue-100 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {product.brand} • {product.category}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-full shadow-sm ${
                    inWishlist ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400 hover:text-rose-500'
                  }`}
                  title={inWishlist ? 'In your wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings Bar */}
            <div className="flex items-center space-x-4 mt-3">
              <RatingStars rating={product.rating || 4.5} numReviews={reviews.length || product.numReviews} size="md" />
              <span className="text-slate-300">|</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                <Check className="w-3.5 h-3.5 mr-1" />
                Verified Purchaser Rated
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-slate-900">
                  ₹{effectivePrice.toLocaleString('en-IN')}
                </span>
                {discountPercent > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                Inclusive of all taxes & free express delivery
              </p>
            </div>

            {/* Stock status badge */}
            <div className="text-right">
              {product.stock > 0 ? (
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="p-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-xs font-bold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="p-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                product.stock === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95 shadow-sm'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={`py-3.5 px-6 rounded-2xl font-bold text-xs text-white flex items-center justify-center space-x-2 transition-all ${
                product.stock === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 active:scale-95'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Service Promises */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 rounded-xl bg-slate-50">
              <Truck className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <p className="text-[10px] font-bold text-slate-800">Express Delivery</p>
              <p className="text-[9px] text-slate-400">Dispatch in 24 hours</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <RotateCcw className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <p className="text-[10px] font-bold text-slate-800">7 Days Return</p>
              <p className="text-[9px] text-slate-400">Doorstep pickup</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <p className="text-[10px] font-bold text-slate-800">100% Genuine</p>
              <p className="text-[9px] text-slate-400">Direct from brand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <span>Product Specifications & Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications.map((spec, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/60"
              >
                <span className="text-xs font-semibold text-slate-500">{spec.key}</span>
                <span className="text-xs font-bold text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Ratings & Reviews */}
      <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h2>
            <div className="flex items-center space-x-3 mt-1">
              <RatingStars rating={product.rating || 4.5} size="md" />
              <span className="text-xs text-slate-500">Based on {reviews.length} customer reviews</span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow flex items-center self-start sm:self-auto space-x-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No customer reviews yet. Be the first to share your verified experience!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="pb-6 border-b border-slate-100 last:border-b-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.userName}</h4>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                          <Check className="w-3 h-3 mr-0.5" /> Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  {rev.title && (
                    <span className="text-xs font-bold text-slate-800 ml-2">{rev.title}</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products Recommendation Row */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Rate & Review "{product.name}"
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          s <= reviewRating
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excellent build quality and punchy bass!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Written Feedback
                </label>
                <textarea
                  rows={4}
                  placeholder="What did you like or dislike about this product? How is the performance?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow transition-colors disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
