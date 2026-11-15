import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const effectivePrice =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

  const discountPercent =
    product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Badges & Wishlist Button */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <Link to={`/product/${product._id || product.slug}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
              Best Seller
            </span>
          )}
          {product.isDeal && !discountPercent && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
              Special Deal
            </span>
          )}
        </div>

        {/* Wishlist toggle icon */}
        <button
          onClick={handleToggleWishlist}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-sm ${
            inWishlist
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 backdrop-blur-sm text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-3 bg-amber-500/90 text-white text-[10px] font-medium px-2 py-0.5 rounded">
            Only {product.stock} left in stock!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium text-blue-600 uppercase tracking-wider text-[10px]">
            {product.category}
          </span>
          <span>{product.brand}</span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product._id || product.slug}`}
          className="font-semibold text-slate-800 hover:text-blue-600 line-clamp-2 text-sm leading-snug mb-2 transition-colors"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating || 4.5} numReviews={product.numReviews} size="sm" />
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-bold text-slate-900">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 font-medium">Free Delivery</p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
