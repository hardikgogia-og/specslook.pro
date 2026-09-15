import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Truck,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SpecslookLogo } from './SpecslookLogo.tsx';
import { useStore, AppView } from '../context/StoreContext.tsx';

export const Navbar: React.FC = () => {
  const {
    currentView,
    viewParams,
    navigateTo,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    products
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<'eyeglasses' | 'sunglasses' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'eyeglasses' | 'sunglasses' | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.specifications?.gender && p.specifications.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
            p.specifications.frameShape.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleNavClick = (view: AppView, params = {}) => {
    navigateTo(view, params);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setActiveDropdown(null);
  };

  const handleMouseEnterDropdown = (menu: 'eyeglasses' | 'sunglasses') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-xs">
      {/* Top Announcement Bar - Thin, 1-line continuous moving slider */}
      <div className="bg-neutral-950 text-neutral-200 text-[11px] h-7 sm:h-7.5 flex items-center overflow-hidden border-b border-neutral-900 select-none relative">
        <div className="animate-ticker items-center py-1 font-medium tracking-wider text-[11px] whitespace-nowrap">
          {/* Ticker Block 1 */}
          <div className="inline-flex items-center gap-6 px-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ACTIVE OFFERS:
            </span>
            <span className="text-white">USE CODE: <strong className="text-emerald-400 font-extrabold tracking-wider">WELCOME500</strong> (FLAT ₹500 OFF)</span>
            <span className="text-neutral-700">|</span>
            <span className="text-white">USE CODE: <strong className="text-emerald-400 font-extrabold tracking-wider">SPECS10</strong> (10% OFF ON ₹1,999+)</span>
            <span className="text-neutral-700">|</span>
            <span className="text-white">USE CODE: <strong className="text-emerald-400 font-extrabold tracking-wider">LOOK20</strong> (20% OFF ON ₹4,999+)</span>
            <span className="text-neutral-600">•</span>
            <span className="text-[#00DF1D] font-extrabold tracking-wider bg-[#00DF1D]/15 px-2.5 py-0.5 rounded-xs border border-[#00DF1D]/40">
              100% CASH ON DELIVERY (COD) AVAILABLE ACROSS INDIA
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300">FREE DELIVERY ON ₹999+ & 14-DAY DOORSTEP TRIAL</span>
            <span className="text-neutral-600">•</span>
            <span className="text-white">EYEGLASSES & SUNGLASSES FOR MEN, WOMEN & KIDS</span>
          </div>

          {/* Ticker Block 2 (Duplicate for seamless continuous moving loop) */}
          <div className="inline-flex items-center gap-6 px-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ACTIVE OFFERS:
            </span>
            <span className="text-white">USE CODE: <strong className="text-emerald-400 font-extrabold tracking-wider">WELCOME500</strong> (FLAT ₹500 OFF)</span>
            <span className="text-neutral-700">|</span>
            <span className="text-white">USE CODE: <strong className="text-emerald-400 font-extrabold tracking-wider">SPECS10</strong> (10% OFF ON ₹1,999+)</span>
            <span className="text-neutral-700">|</span>
            <span className="text-white">USE CODE: <strong className="text-emerald-400 font-extrabold tracking-wider">LOOK20</strong> (20% OFF ON ₹4,999+)</span>
            <span className="text-neutral-600">•</span>
            <span className="text-[#00DF1D] font-extrabold tracking-wider bg-[#00DF1D]/15 px-2.5 py-0.5 rounded-xs border border-[#00DF1D]/40">
              100% CASH ON DELIVERY (COD) AVAILABLE ACROSS INDIA
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300">FREE DELIVERY ON ₹999+ & 14-DAY DOORSTEP TRIAL</span>
            <span className="text-neutral-600">•</span>
            <span className="text-white">EYEGLASSES & SUNGLASSES FOR MEN, WOMEN & KIDS</span>
          </div>
        </div>

        {/* Quick action buttons pinned on right */}
        <div className="hidden xl:flex items-center gap-3 bg-neutral-950/95 pl-4 pr-3 py-1 absolute right-0 top-0 bottom-0 text-[10px] text-neutral-400 shadow-[-12px_0_15px_rgba(0,0,0,0.8)] border-l border-neutral-800">
          <button
            onClick={() => handleNavClick('tracking')}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Truck className="w-3 h-3 text-neutral-400" />
            <span>Track Order</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 text-neutral-800 hover:text-neutral-950"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center cursor-pointer select-none"
        >
          <SpecslookLogo size="md" />
        </div>

        {/* Desktop Primary Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-semibold text-xs tracking-wider uppercase">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors py-2 relative hover:text-red-600 ${
              currentView === 'home' ? 'text-red-600 font-bold' : 'text-neutral-800'
            }`}
          >
            Home
            {currentView === 'home' && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600"></span>}
          </button>

          {/* EYEGLASSES DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnterDropdown('eyeglasses')}
            onMouseLeave={handleMouseLeaveDropdown}
          >
            <button
              onClick={() => handleNavClick('shop', { category: 'Eyeglasses' })}
              className={`transition-colors py-2 relative flex items-center gap-1 hover:text-red-600 ${
                currentView === 'shop' && viewParams.category === 'Eyeglasses'
                  ? 'text-red-600 font-bold'
                  : 'text-neutral-800'
              }`}
            >
              <span>Eyeglasses</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'eyeglasses' ? 'rotate-180 text-red-600' : 'text-neutral-400'}`} />
              {currentView === 'shop' && viewParams.category === 'Eyeglasses' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600"></span>
              )}
            </button>

            {/* Eyeglasses Dropdown Panel */}
            {activeDropdown === 'eyeglasses' && (
              <div className="absolute top-full left-0 w-80 bg-white border border-neutral-200 shadow-xl rounded-b-md p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 pb-1.5 border-b border-neutral-100">
                  Shop Eyeglasses By Category
                </div>
                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => handleNavClick('shop', { category: 'Eyeglasses', gender: 'Men' })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xs flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600">For Men</div>
                      <div className="text-[10px] text-neutral-500 normal-case">Executive titanium, square & browline frames</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavClick('shop', { category: 'Eyeglasses', gender: 'Women' })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xs flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600">For Women</div>
                      <div className="text-[10px] text-neutral-500 normal-case">Cat-eye, champagne crystal & rose gold optics</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavClick('shop', { category: 'Eyeglasses', gender: 'Kids' })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xs flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600">For Kids</div>
                      <div className="text-[10px] text-neutral-500 normal-case">Shatterproof flex TR90 & blue-light study frames</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavClick('shop', { category: 'Eyeglasses' })}
                    className="w-full text-left px-3 py-2 mt-1 bg-neutral-50 hover:bg-neutral-100 rounded-xs flex items-center justify-between group font-bold text-xs text-neutral-900"
                  >
                    <span>View All Eyeglasses</span>
                    <span className="text-[10px] text-red-600">Explore &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SUNGLASSES DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnterDropdown('sunglasses')}
            onMouseLeave={handleMouseLeaveDropdown}
          >
            <button
              onClick={() => handleNavClick('shop', { category: 'Sunglasses' })}
              className={`transition-colors py-2 relative flex items-center gap-1 hover:text-red-600 ${
                currentView === 'shop' && viewParams.category === 'Sunglasses'
                  ? 'text-red-600 font-bold'
                  : 'text-neutral-800'
              }`}
            >
              <span>Sunglasses</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'sunglasses' ? 'rotate-180 text-red-600' : 'text-neutral-400'}`} />
              {currentView === 'shop' && viewParams.category === 'Sunglasses' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600"></span>
              )}
            </button>

            {/* Sunglasses Dropdown Panel */}
            {activeDropdown === 'sunglasses' && (
              <div className="absolute top-full left-0 w-80 bg-white border border-neutral-200 shadow-xl rounded-b-md p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 pb-1.5 border-b border-neutral-100">
                  Shop Sunglasses By Category
                </div>
                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => handleNavClick('shop', { category: 'Sunglasses', gender: 'Men' })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xs flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600">For Men</div>
                      <div className="text-[10px] text-neutral-500 normal-case">Aviator Pilot, Justin Matte Wrap & Clubmaster</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavClick('shop', { category: 'Sunglasses', gender: 'Women' })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xs flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600">For Women</div>
                      <div className="text-[10px] text-neutral-500 normal-case">Oversized Butterfly, Cat-eye & Rose Gold Hexagon</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavClick('shop', { category: 'Sunglasses', gender: 'Kids' })}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xs flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-red-600">For Kids</div>
                      <div className="text-[10px] text-neutral-500 normal-case">100% UV400 Child Aviator & Shatterproof Wayfarer</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavClick('shop', { category: 'Sunglasses' })}
                    className="w-full text-left px-3 py-2 mt-1 bg-neutral-50 hover:bg-neutral-100 rounded-xs flex items-center justify-between group font-bold text-xs text-neutral-900"
                  >
                    <span>View All Sunglasses</span>
                    <span className="text-[10px] text-red-600">Explore &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ATTACHMENTS (6-in-1 & 2-in-1 Clip-Ons) */}
          <button
            onClick={() => handleNavClick('shop', { category: 'Attachments' })}
            className={`transition-colors py-2 relative flex items-center gap-1.5 hover:text-red-600 ${
              currentView === 'shop' && viewParams.category === 'Attachments'
                ? 'text-red-600 font-bold'
                : 'text-neutral-800'
            }`}
          >
            <span>Attachments</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-neutral-900 text-white rounded-xs tracking-wider">
              6-in-1
            </span>
            {currentView === 'shop' && viewParams.category === 'Attachments' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600"></span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('shop')}
            className={`text-neutral-800 hover:text-red-600 transition-colors py-2 ${
              currentView === 'shop' && !viewParams.category ? 'text-red-600 font-bold' : ''
            }`}
          >
            All Frames
          </button>

          <button
            onClick={() => handleNavClick('stores')}
            className="text-neutral-800 hover:text-red-600 transition-colors py-2"
          >
            Our Stores
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className="text-neutral-800 hover:text-red-600 transition-colors py-2"
          >
            About Us
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
            className="p-2 text-neutral-700 hover:text-red-600 transition-colors rounded-full hover:bg-neutral-100"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Track Order Icon (Mobile / Tablet) */}
          <button
            onClick={() => handleNavClick('tracking')}
            title="Track Order"
            aria-label="Track Order"
            className="p-2 text-neutral-700 hover:text-red-600 transition-colors rounded-full hover:bg-neutral-100 lg:hidden"
          >
            <Truck className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => handleNavClick('account', { tab: 'wishlist' })}
            aria-label="Wishlist"
            className="relative p-2 text-neutral-700 hover:text-red-600 transition-colors rounded-full hover:bg-neutral-100"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Bag */}
          <button
            id="open-cart-drawer"
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Bag"
            className="relative p-2 text-neutral-900 hover:text-red-600 transition-colors rounded-full hover:bg-neutral-100"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Live Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-neutral-200 bg-white py-4 px-4 sm:px-8 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-5 h-5 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Men, Women, Kids eyeglasses, sunglasses or styles..."
                className="w-full pl-11 pr-10 py-3 text-sm bg-neutral-100 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick search suggestions */}
            {searchResults.length > 0 && (
              <div className="mt-3 bg-white border border-neutral-200 divide-y divide-neutral-100 shadow-md">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      navigateTo('product', { slug: product.slug, id: product.id });
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-3 flex items-center gap-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-10 object-contain mix-blend-multiply bg-neutral-100 rounded-xs"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-neutral-900">{product.name}</div>
                      <div className="text-[11px] text-neutral-500">
                        {product.category} • For {product.specifications.gender} • {product.specifications.frameShape}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-neutral-900">
                        ₹{product.salePrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-red-600 font-medium">View Frame &rarr;</div>
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => {
                    navigateTo('shop', { search: searchQuery });
                    setIsSearchOpen(false);
                  }}
                  className="p-2.5 text-center bg-neutral-50 text-xs font-bold text-neutral-900 hover:text-red-600 cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>See all results for "{searchQuery}"</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 flex flex-col gap-1 shadow-2xl max-h-[80vh] overflow-y-auto">
          <button
            onClick={() => handleNavClick('home')}
            className="py-2.5 px-3 text-left font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm"
          >
            Home
          </button>

          {/* Eyeglasses Accordion */}
          <div className="border-b border-neutral-100 pb-1">
            <button
              onClick={() => setMobileExpandedCat(mobileExpandedCat === 'eyeglasses' ? null : 'eyeglasses')}
              className="w-full py-2.5 px-3 flex items-center justify-between font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm"
            >
              <span>Eyeglasses</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedCat === 'eyeglasses' ? 'rotate-180 text-red-600' : ''}`} />
            </button>
            {mobileExpandedCat === 'eyeglasses' && (
              <div className="pl-4 py-1 space-y-1 bg-neutral-50 rounded-xs mb-1">
                <button
                  onClick={() => handleNavClick('shop', { category: 'Eyeglasses', gender: 'Men' })}
                  className="w-full py-2 px-3 text-left text-xs font-semibold text-neutral-700 hover:text-red-600"
                >
                  • Eyeglasses for Men
                </button>
                <button
                  onClick={() => handleNavClick('shop', { category: 'Eyeglasses', gender: 'Women' })}
                  className="w-full py-2 px-3 text-left text-xs font-semibold text-neutral-700 hover:text-red-600"
                >
                  • Eyeglasses for Women
                </button>
                <button
                  onClick={() => handleNavClick('shop', { category: 'Eyeglasses', gender: 'Kids' })}
                  className="w-full py-2 px-3 text-left text-xs font-semibold text-neutral-700 hover:text-red-600"
                >
                  • Eyeglasses for Kids
                </button>
                <button
                  onClick={() => handleNavClick('shop', { category: 'Eyeglasses' })}
                  className="w-full py-2 px-3 text-left text-xs font-bold text-red-600"
                >
                  • View All Eyeglasses &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Sunglasses Accordion */}
          <div className="border-b border-neutral-100 pb-1">
            <button
              onClick={() => setMobileExpandedCat(mobileExpandedCat === 'sunglasses' ? null : 'sunglasses')}
              className="w-full py-2.5 px-3 flex items-center justify-between font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm"
            >
              <span>Sunglasses</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpandedCat === 'sunglasses' ? 'rotate-180 text-red-600' : ''}`} />
            </button>
            {mobileExpandedCat === 'sunglasses' && (
              <div className="pl-4 py-1 space-y-1 bg-neutral-50 rounded-xs mb-1">
                <button
                  onClick={() => handleNavClick('shop', { category: 'Sunglasses', gender: 'Men' })}
                  className="w-full py-2 px-3 text-left text-xs font-semibold text-neutral-700 hover:text-red-600"
                >
                  • Sunglasses for Men
                </button>
                <button
                  onClick={() => handleNavClick('shop', { category: 'Sunglasses', gender: 'Women' })}
                  className="w-full py-2 px-3 text-left text-xs font-semibold text-neutral-700 hover:text-red-600"
                >
                  • Sunglasses for Women
                </button>
                <button
                  onClick={() => handleNavClick('shop', { category: 'Sunglasses', gender: 'Kids' })}
                  className="w-full py-2 px-3 text-left text-xs font-semibold text-neutral-700 hover:text-red-600"
                >
                  • Sunglasses for Kids
                </button>
                <button
                  onClick={() => handleNavClick('shop', { category: 'Sunglasses' })}
                  className="w-full py-2 px-3 text-left text-xs font-bold text-red-600"
                >
                  • View All Sunglasses &rarr;
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('shop', { category: 'Attachments' })}
            className="py-2.5 px-3 text-left font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm flex items-center justify-between"
          >
            <span>Attachments (6-in-1 & 2-in-1)</span>
            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-neutral-900 text-white rounded-xs">
              NEW
            </span>
          </button>

          <button
            onClick={() => handleNavClick('shop')}
            className="py-2.5 px-3 text-left font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm"
          >
            Shop All Frames
          </button>
          <button
            onClick={() => handleNavClick('stores')}
            className="py-2.5 px-3 text-left font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm"
          >
            Our Stores & Boutiques
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="py-2.5 px-3 text-left font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm"
          >
            The Specslook Story
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="py-2.5 px-3 text-left font-bold text-sm text-neutral-900 hover:bg-neutral-100 rounded-sm"
          >
            Contact Customer Concierge
          </button>
          <div className="pt-4 mt-2 border-t border-neutral-200 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('tracking')}
              className="py-2.5 px-3 bg-neutral-100 text-neutral-900 text-xs font-bold rounded-sm flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-red-600" />
              Track Your Shipment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
