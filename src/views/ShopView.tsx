import React, { useState, useMemo, useEffect } from 'react';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Search, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export const ShopView: React.FC = () => {
  const { products, viewParams } = useStore();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(viewParams.category || 'All');
  const [selectedShape, setSelectedShape] = useState<string>(viewParams.shape || 'All');
  const [selectedGender, setSelectedGender] = useState<string>(viewParams.gender || 'All');
  const [onlyPolarized, setOnlyPolarized] = useState<boolean>(viewParams.polarized === true);
  const [priceRange, setPriceRange] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(viewParams.search || '');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync params if passed via navigation
  useEffect(() => {
    setSelectedCategory(viewParams.category || 'All');
    setSelectedGender(viewParams.gender || 'All');
    setSelectedShape(viewParams.shape || 'All');
    setOnlyPolarized(viewParams.polarized === true);
    setSearchQuery(viewParams.search || '');
  }, [viewParams]);

  const categories = ['All', 'Eyeglasses', 'Sunglasses', 'Attachments'];
  const shapes = ['All', 'Aviator', 'Wayfarer', 'Clubmaster', 'Round', 'Hexagonal', 'Square', 'Cat-Eye', 'Rectangular'];
  const genders = ['All', 'Men', 'Women', 'Kids', 'Unisex'];
  const priceBrackets = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ₹3,500', value: '0-3500' },
    { label: '₹3,500 - ₹6,000', value: '3500-6000' },
    { label: '₹6,000 - ₹9,000', value: '6000-9000' },
    { label: 'Above ₹9,000', value: '9000-999999' }
  ];

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedShape('All');
    setSelectedGender('All');
    setOnlyPolarized(false);
    setPriceRange('All');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedShape !== 'All' ||
    selectedGender !== 'All' ||
    onlyPolarized ||
    priceRange !== 'All' ||
    searchQuery !== '';

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

        // Shape
        if (selectedShape !== 'All' && p.specifications.frameShape !== selectedShape) return false;

        // Gender
        if (selectedGender !== 'All') {
          if (selectedGender === 'Kids') {
            if (p.specifications.gender !== 'Kids') return false;
          } else if (selectedGender === 'Men') {
            if (p.specifications.gender !== 'Men' && p.specifications.gender !== 'Unisex') return false;
          } else if (selectedGender === 'Women') {
            if (p.specifications.gender !== 'Women' && p.specifications.gender !== 'Unisex') return false;
          } else if (selectedGender === 'Unisex') {
            if (p.specifications.gender !== 'Unisex') return false;
          }
        }

        // Polarized
        if (onlyPolarized && !p.specifications.isPolarized) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchShape = p.specifications.frameShape.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchGender = p.specifications.gender?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchShape && !matchCat && !matchGender) return false;
        }

        // Price range
        if (priceRange !== 'All') {
          const [min, max] = priceRange.split('-').map(Number);
          if (p.salePrice < min || p.salePrice > max) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.salePrice - b.salePrice;
        if (sortBy === 'price-high') return b.salePrice - a.salePrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
        return 0; // default featured
      });
  }, [products, selectedCategory, selectedShape, selectedGender, onlyPolarized, priceRange, searchQuery, sortBy]);

  // Dynamic Header Title
  const getHeaderTitle = () => {
    if (selectedCategory === 'Eyeglasses') {
      if (selectedGender === 'Men') return 'Eyeglasses for Men';
      if (selectedGender === 'Women') return 'Eyeglasses for Women';
      if (selectedGender === 'Kids') return 'Eyeglasses for Kids';
      return 'Precision Eyeglasses';
    }
    if (selectedCategory === 'Sunglasses') {
      if (selectedGender === 'Men') return 'Sunglasses for Men';
      if (selectedGender === 'Women') return 'Sunglasses for Women';
      if (selectedGender === 'Kids') return 'Sunglasses for Kids';
      return 'Iconic Sunglasses';
    }
    if (selectedCategory === 'Attachments') {
      if (selectedGender === 'Men') return 'Magnetic Attachments for Men (6-in-1 & 2-in-1)';
      if (selectedGender === 'Women') return 'Magnetic Attachments for Women (6-in-1 & 2-in-1)';
      return 'Magnetic Attachments (6-in-1 & 2-in-1 Eyeglasses)';
    }
    if (selectedGender === 'Men') return 'Men\'s Eyewear Collection';
    if (selectedGender === 'Women') return 'Women\'s Eyewear Collection';
    if (selectedGender === 'Kids') return 'Kids\' Eyewear Collection';
    return 'All Luxury Eyewear';
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Category Header Hero */}
      <div className="bg-neutral-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span>SPECSLOOK CURATED CATALOG</span>
              {selectedGender !== 'All' && <span>• FOR {selectedGender.toUpperCase()}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              {getHeaderTitle()}
              {selectedShape !== 'All' && ` • ${selectedShape}`}
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Engineered with hand-polished Italian acetate, aerospace titanium, and ultra-high-definition polarized lenses.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <span>Showing <strong className="text-white">{filteredProducts.length}</strong> styles</span>
          </div>
        </div>

        {/* Quick Category Jump Tabs */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => { setSelectedCategory('Eyeglasses'); setSelectedGender('Men'); }}
            className={`px-3 py-1.5 rounded-xs font-bold uppercase tracking-wider transition-colors ${
              selectedCategory === 'Eyeglasses' && selectedGender === 'Men'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Eyeglasses for Men
          </button>
          <button
            onClick={() => { setSelectedCategory('Eyeglasses'); setSelectedGender('Women'); }}
            className={`px-3 py-1.5 rounded-xs font-bold uppercase tracking-wider transition-colors ${
              selectedCategory === 'Eyeglasses' && selectedGender === 'Women'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Eyeglasses for Women
          </button>
          <button
            onClick={() => { setSelectedCategory('Eyeglasses'); setSelectedGender('Kids'); }}
            className={`px-3 py-1.5 rounded-xs font-bold uppercase tracking-wider transition-colors ${
              selectedCategory === 'Eyeglasses' && selectedGender === 'Kids'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Eyeglasses for Kids
          </button>

          <span className="text-neutral-700 self-center hidden sm:inline">|</span>

          <button
            onClick={() => { setSelectedCategory('Sunglasses'); setSelectedGender('Men'); }}
            className={`px-3 py-1.5 rounded-xs font-bold uppercase tracking-wider transition-colors ${
              selectedCategory === 'Sunglasses' && selectedGender === 'Men'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Sunglasses for Men
          </button>
          <button
            onClick={() => { setSelectedCategory('Sunglasses'); setSelectedGender('Women'); }}
            className={`px-3 py-1.5 rounded-xs font-bold uppercase tracking-wider transition-colors ${
              selectedCategory === 'Sunglasses' && selectedGender === 'Women'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Sunglasses for Women
          </button>
          <button
            onClick={() => { setSelectedCategory('Sunglasses'); setSelectedGender('Kids'); }}
            className={`px-3 py-1.5 rounded-xs font-bold uppercase tracking-wider transition-colors ${
              selectedCategory === 'Sunglasses' && selectedGender === 'Kids'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            Sunglasses for Kids
          </button>
        </div>
      </div>

      {/* Glass Add-ons Banner Strip */}
      <div className="bg-neutral-100 border-b border-neutral-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
            <span>OPTICAL GLASS ADD-ONS:</span>
            <span className="font-normal text-neutral-700 hidden md:inline">
              Available during checkout on all optical eyeglasses:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-700">
            <span className="bg-white px-2 py-0.5 border border-neutral-200 rounded-xs">
              SL Anti Glare <strong className="text-red-600">+₹299</strong>
            </span>
            <span className="bg-white px-2 py-0.5 border border-neutral-200 rounded-xs">
              SL BluPro UV <strong className="text-red-600">+₹499</strong>
            </span>
            <span className="bg-white px-2 py-0.5 border border-neutral-200 rounded-xs">
              SL BluUltra UV <strong className="text-red-600">+₹899</strong>
            </span>
            <span className="bg-white px-2 py-0.5 border border-neutral-200 rounded-xs">
              SL PhotoUV Gen 8 <strong className="text-red-600">+₹1,299</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model name, shape, style..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 text-xs font-medium focus:outline-none focus:border-neutral-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort and Mobile Filter Buttons */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold flex items-center gap-2 rounded-xs border border-neutral-300"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
              <span className="hidden sm:inline text-neutral-500 uppercase text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products by"
                className="bg-white border border-neutral-300 py-2.5 px-3 text-xs font-semibold text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="featured">Featured / Curated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-3 border-b border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Active:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-neutral-100 text-neutral-800 text-xs px-2.5 py-1 rounded-xs flex items-center gap-1 font-medium">
                {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {selectedShape !== 'All' && (
              <span className="bg-neutral-100 text-neutral-800 text-xs px-2.5 py-1 rounded-xs flex items-center gap-1 font-medium">
                Shape: {selectedShape}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedShape('All')} />
              </span>
            )}
            {selectedGender !== 'All' && (
              <span className="bg-neutral-100 text-neutral-800 text-xs px-2.5 py-1 rounded-xs flex items-center gap-1 font-medium">
                Gender: {selectedGender}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGender('All')} />
              </span>
            )}
            {onlyPolarized && (
              <span className="bg-neutral-950 text-white text-xs px-2.5 py-1 rounded-xs flex items-center gap-1 font-medium">
                Polarized Pro
                <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyPolarized(false)} />
              </span>
            )}
            {priceRange !== 'All' && (
              <span className="bg-neutral-100 text-neutral-800 text-xs px-2.5 py-1 rounded-xs flex items-center gap-1 font-medium">
                {priceBrackets.find((b) => b.value === priceRange)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('All')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 font-bold hover:underline ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Layout: Sidebar Filters (Desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4">
            {/* Category Filter */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-900 mb-3 pb-1 border-b border-neutral-200">
                Product Category
              </h3>
              <div className="space-y-1.5 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left py-1 px-2 rounded-xs flex items-center justify-between transition-colors ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100 font-medium'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Filter */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-900 mb-3 pb-1 border-b border-neutral-200">
                Frame Shape
              </h3>
              <div className="space-y-1 text-xs">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`w-full text-left py-1 px-2 rounded-xs flex items-center justify-between transition-colors ${
                      selectedShape === shape
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100 font-medium'
                    }`}
                  >
                    <span>{shape}</span>
                    {selectedShape === shape && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Polarized Toggle */}
            <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPolarized}
                  onChange={(e) => setOnlyPolarized(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded-xs"
                />
                <div className="flex-1">
                  <div className="font-bold text-xs text-neutral-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                    <span>Chromance Polarized</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">Only show anti-glare crystal glass</div>
                </div>
              </label>
            </div>

            {/* Gender Filter */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-900 mb-3 pb-1 border-b border-neutral-200">
                Gender Fit
              </h3>
              <div className="space-y-1 text-xs">
                {genders.map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setSelectedGender(gender)}
                    className={`w-full text-left py-1 px-2 rounded-xs flex items-center justify-between transition-colors ${
                      selectedGender === gender
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100 font-medium'
                    }`}
                  >
                    <span>{gender}</span>
                    {selectedGender === gender && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-900 mb-3 pb-1 border-b border-neutral-200">
                Price (INR)
              </h3>
              <div className="space-y-1 text-xs">
                {priceBrackets.map((bracket) => (
                  <button
                    key={bracket.value}
                    onClick={() => setPriceRange(bracket.value)}
                    className={`w-full text-left py-1 px-2 rounded-xs flex items-center justify-between transition-colors ${
                      priceRange === bracket.value
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-100 font-medium'
                    }`}
                  >
                    <span>{bracket.label}</span>
                    {priceRange === bracket.value && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Product Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-xs p-8">
                <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-neutral-900">No frames match your filters</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-6">
                  Try adjusting or clearing your active filters to view other iconic Specslook silhouettes.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-neutral-900 hover:bg-red-600 text-white text-xs font-bold py-2.5 px-6 uppercase tracking-wider transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <h3 className="font-extrabold text-sm uppercase text-neutral-900">Filter Eyewear</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-neutral-900 mb-2">Category</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        className={`text-xs px-3 py-1.5 border rounded-xs font-medium ${
                          selectedCategory === c ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Shapes */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-neutral-900 mb-2">Shape</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {shapes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedShape(s)}
                        className={`text-xs px-3 py-1.5 border rounded-xs font-medium ${
                          selectedShape === s ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Polarized */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={onlyPolarized}
                      onChange={(e) => setOnlyPolarized(e.target.checked)}
                      className="w-4 h-4 accent-red-600"
                    />
                    <span className="text-xs font-bold text-neutral-900">Only Polarized Optics</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200 flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 text-xs font-bold border border-neutral-300 uppercase tracking-wider text-neutral-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 text-xs font-bold bg-neutral-900 text-white uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
