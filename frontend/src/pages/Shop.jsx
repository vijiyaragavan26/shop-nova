import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [isDeal, setIsDeal] = useState(searchParams.get('isDeal') === 'true');
  const [isFeatured, setIsFeatured] = useState(searchParams.get('isFeatured') === 'true');
  const [isBestSeller, setIsBestSeller] = useState(searchParams.get('isBestSeller') === 'true');

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty & Grooming',
    'Sports & Fitness',
    'Audio & Sound'
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort
      };

      if (category && category !== 'all' && category !== 'All Categories') {
        params.category = category;
      }
      if (keyword.trim()) params.keyword = keyword.trim();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;
      if (isDeal) params.isDeal = true;
      if (isFeatured) params.isFeatured = true;
      if (isBestSeller) params.isBestSeller = true;

      const res = await productAPI.getProducts(params);
      setProducts(res.data.products);
      setTotalProducts(res.data.totalProducts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to load products:', err.message);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    category,
    keyword,
    sort,
    minPrice,
    maxPrice,
    minRating,
    isDeal,
    isFeatured,
    isBestSeller
  ]);

  // Sync state with search params changes
  useEffect(() => {
    if (searchParams.get('category')) setCategory(searchParams.get('category'));
    if (searchParams.get('keyword')) setKeyword(searchParams.get('keyword'));
    if (searchParams.get('sort')) setSort(searchParams.get('sort'));
    if (searchParams.get('isDeal')) setIsDeal(searchParams.get('isDeal') === 'true');
    if (searchParams.get('isFeatured')) setIsFeatured(searchParams.get('isFeatured') === 'true');
    if (searchParams.get('isBestSeller')) setIsBestSeller(searchParams.get('isBestSeller') === 'true');
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setCategory('all');
    setKeyword('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSort('newest');
    setIsDeal(false);
    setIsFeatured(false);
    setIsBestSeller(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Explore Products
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Showing {products.length} of {totalProducts} verified items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center font-semibold"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((c) => {
                  const val = c === 'All Categories' ? 'all' : c;
                  const isSelected = category.toLowerCase() === val.toLowerCase();
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setCategory(val);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{c}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Price Range (₹)
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Customer Rating */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Customer Rating
              </h3>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setMinRating(minRating === String(stars) ? '' : String(stars));
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      minRating === String(stars)
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <div className="flex items-center text-amber-400">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span>& Up</span>
                    </div>
                    {minRating === String(stars) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges / Special Filters */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="flex items-center space-x-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeal}
                  onChange={(e) => {
                    setIsDeal(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Special Deals & Offers</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => {
                    setIsBestSeller(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Best Sellers Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Main Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filter Products</span>
            </button>

            {/* Search filter keyword */}
            <div className="w-full sm:w-auto flex-1 max-w-sm relative">
              <input
                type="text"
                placeholder="Search within results..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-xl outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Popularity / Reviews</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid / Empty State / Loading */}
          {loading ? (
            <div className="min-h-[350px] flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-slate-400">Loading catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products matched your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for different keywords or clear your active price and category filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Categories
              </h4>
              <div className="space-y-1">
                {categories.map((c) => {
                  const val = c === 'All Categories' ? 'all' : c;
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setCategory(val);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                        category.toLowerCase() === val.toLowerCase()
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                handleResetFilters();
                setIsMobileFilterOpen(false);
              }}
              className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
