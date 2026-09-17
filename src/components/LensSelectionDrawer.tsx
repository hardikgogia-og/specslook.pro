import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Check,
  Shield,
  Eye,
  Glasses,
  Layers,
  Sparkles,
  Sun,
  Laptop,
  CheckCircle2,
  FileText,
  Calendar,
  Zap,
  Info,
  ChevronRight,
  ShoppingBag,
  Truck
} from 'lucide-react';
import {
  Product,
  LensAddon,
  VisionType,
  SINGLE_VISION_LENS_ADDONS,
  BIFOCAL_LENS_ADDONS,
  PROGRESSIVE_LENS_ADDONS,
  SUNGLASS_LENS_ADDONS,
  SUNGLASS_SINGLE_VISION_LENS_ADDONS,
  SUNGLASS_PROGRESSIVE_LENS_ADDONS
} from '../types';

interface LensSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedLensAddon: LensAddon;
  onSelectLensAddon: (addon: LensAddon) => void;
  onConfirmAndAddToCart: (addon: LensAddon, target?: 'cart' | 'checkout') => void;
}

export const LensSelectionDrawer: React.FC<LensSelectionDrawerProps> = ({
  isOpen,
  onClose,
  product,
  selectedLensAddon,
  onSelectLensAddon,
  onConfirmAndAddToCart
}) => {
  const isSunglasses = Boolean(product.category && product.category.toLowerCase().includes('sunglass'));
  const isAttachment = Boolean(
    product.category && (
      product.category.toLowerCase().includes('attachment') ||
      product.category.toLowerCase().includes('clip')
    )
  );

  // Current Layer / Step: 1 = Vision Type, 2 = Lens Package, 3 = Review & Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Active Vision Type
  const [selectedVisionType, setSelectedVisionType] = useState<VisionType>(
    selectedLensAddon.visionType || 'single_vision'
  );

  // Temporary selected lens in drawer
  const [tempLens, setTempLens] = useState<LensAddon>(selectedLensAddon);

  // Sync temp lens with prop when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTempLens(selectedLensAddon);
      setSelectedVisionType(selectedLensAddon.visionType || 'single_vision');
      // If user already had a non-demo lens selected, start on step 2, otherwise step 1
      if (selectedLensAddon.id && selectedLensAddon.id !== 'none' && selectedLensAddon.id !== 'sg-standard') {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
  }, [isOpen, selectedLensAddon]);

  if (!isOpen) return null;

  // Handle selecting vision type in Layer 1
  const handleSelectVision = (vType: VisionType) => {
    setSelectedVisionType(vType);
    let defaultList: LensAddon[] = [];
    if (isSunglasses) {
      defaultList = vType === 'progressive' ? SUNGLASS_PROGRESSIVE_LENS_ADDONS : SUNGLASS_SINGLE_VISION_LENS_ADDONS;
    } else {
      defaultList =
        vType === 'bifocal'
          ? BIFOCAL_LENS_ADDONS
          : vType === 'progressive'
            ? PROGRESSIVE_LENS_ADDONS
            : isAttachment
              ? SINGLE_VISION_LENS_ADDONS.filter((l) => l.id !== 'sl-photouv' && l.id !== 'none')
              : SINGLE_VISION_LENS_ADDONS.filter((l) => l.id !== 'none');
    }
    if (defaultList.length > 0) {
      setTempLens(defaultList[0]);
    }
    setCurrentStep(2);
  };

  // Handle selecting zero power / frame only in Layer 1
  const handleSelectFrameOnly = () => {
    const demo = isSunglasses ? SUNGLASS_LENS_ADDONS[0] : SINGLE_VISION_LENS_ADDONS[0];
    setTempLens(demo);
    setCurrentStep(3);
  };

  // Handle selecting lens package in Layer 2
  const handleSelectPackage = (addon: LensAddon) => {
    setTempLens(addon);
    setCurrentStep(3);
  };

  // Handle final confirmation
  const handleFinalConfirm = (target: 'cart' | 'checkout' = 'cart') => {
    onSelectLensAddon(tempLens);
    onConfirmAndAddToCart(tempLens, target);
    onClose();
  };

  // Lens lists for Layer 2
  const activeLensPackages: LensAddon[] = isSunglasses
    ? (selectedVisionType === 'progressive' ? SUNGLASS_PROGRESSIVE_LENS_ADDONS : SUNGLASS_SINGLE_VISION_LENS_ADDONS)
    : selectedVisionType === 'bifocal'
      ? BIFOCAL_LENS_ADDONS
      : selectedVisionType === 'progressive'
        ? PROGRESSIVE_LENS_ADDONS
        : isAttachment
          ? SINGLE_VISION_LENS_ADDONS.filter((l) => l.id !== 'sl-photouv')
          : SINGLE_VISION_LENS_ADDONS;

  const totalCalculatedPrice = product.salePrice + (tempLens.price || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container (Side popup on PC: max-w-lg w-full, Fullscreen on mobile: w-full inset-0) */}
      <div
        id="lens-selection-drawer"
        className="relative w-full sm:max-w-xl bg-white h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div className="px-4 py-3.5 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : 1))}
                className="p-1 text-neutral-400 hover:text-white transition-colors"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-500">
                  Step {currentStep} of 3
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[200px]">
                  {currentStep === 1 && 'Select Vision Type'}
                  {currentStep === 2 && 'Select Lens Package'}
                  {currentStep === 3 && 'Review & Add to Cart'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate max-w-[260px] sm:max-w-xs">
                {product.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Layers Progress Indicator */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-2 flex items-center justify-between shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 font-bold ${
              currentStep === 1 ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep >= 1 ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-600'
              }`}
            >
              1
            </span>
            <span className="hidden sm:inline">Vision Type</span>
            <span className="sm:hidden">Vision</span>
          </button>
          <span className="text-neutral-300">/</span>

          <button
            type="button"
            onClick={() => {
              if (tempLens.id !== 'none' && tempLens.id !== 'sg-standard') setCurrentStep(2);
            }}
            className={`flex items-center gap-1.5 font-bold ${
              currentStep === 2
                ? 'text-neutral-900'
                : currentStep > 2
                  ? 'text-neutral-700'
                  : 'text-neutral-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep >= 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-600'
              }`}
            >
              2
            </span>
            <span className="hidden sm:inline">Lens Package</span>
            <span className="sm:hidden">Package</span>
          </button>
          <span className="text-neutral-300">/</span>

          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1.5 font-bold ${
              currentStep === 3 ? 'text-neutral-900' : 'text-neutral-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                currentStep === 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-300 text-neutral-600'
              }`}
            >
              3
            </span>
            <span>Confirm</span>
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* =========================================================================
              LAYER 1: SELECT VISION TYPE
             ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-3.5">
              <div className="border-b border-neutral-100 pb-2">
                <h3 className="font-black text-sm uppercase tracking-tight text-neutral-900">
                  {isSunglasses ? 'Select Sunglasses Power Option' : 'Select Your Vision Type'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {isSunglasses
                    ? 'Choose non-powered sun protection or custom prescription sunglasses lenses'
                    : 'Choose the lens type that matches your eye power prescription or lifestyle'}
                </p>
              </div>

              {/* Quick Option: Buy Frame Only / Without Lenses */}
              <div
                onClick={handleSelectFrameOnly}
                className="p-3.5 border border-neutral-300 rounded-xs hover:border-neutral-900 bg-white hover:bg-neutral-50 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 group-hover:bg-neutral-200">
                    <Glasses className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">
                      {isSunglasses
                        ? 'Standard Non-Powered Sunglasses'
                        : 'Buy Frame Only (Without Lenses)'}
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      {isSunglasses
                        ? '100% UV400 sun blocking lenses fitted (Zero power • Ready to wear)'
                        : 'Zero power optical demo lenses fitted • Ready for your local optician'}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-xs">
                    ₹0 Extra
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 mt-1 ml-auto" />
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink mx-2 text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider">
                  {isSunglasses ? 'Or Add Prescription Sun Lenses' : 'Or Add Precision Lenses'}
                </span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>

              {/* Vision Option 1: Single Vision */}
              <div
                onClick={() => handleSelectVision('single_vision')}
                className={`p-3.5 border rounded-xs cursor-pointer transition-all flex items-start justify-between group ${
                  selectedVisionType === 'single_vision'
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Lens Visual Illustration */}
                  <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex flex-col items-center justify-center shrink-0 relative overflow-hidden shadow-xs">
                    <div className="w-7 h-7 rounded-full border border-blue-400/80 bg-white flex items-center justify-center">
                      <span className="text-[7px] font-black text-blue-900">1 ZONE</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-neutral-900">
                        {isSunglasses ? 'Single Vision UV400' : 'Single Vision'}
                      </h4>
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded-xs">
                        {isSunglasses ? 'Sun Prescription' : 'Most Popular'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                      {isSunglasses
                        ? 'For Distance or Reading with full UV400 outdoor protection tinted to match sunglasses frame.'
                        : 'For Distance only OR Reading only. Single continuous corrective power throughout the entire lens surface.'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-neutral-500">
                      {isSunglasses ? (
                        <>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">UV400 Protected (₹899)</span>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">UV400 Thin Japanese (₹1,199)</span>
                        </>
                      ) : (
                        <>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">Distance / Driving</span>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">Reading / Books</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-neutral-900 block">
                    {isSunglasses ? 'From ₹899' : 'From ₹299'}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    {isSunglasses ? '₹1,799' : '₹599'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto mt-2" />
                </div>
              </div>

              {/* Vision Option 2: Bi-Focal (Eyeglasses & Attachments Only - NOT on Sunglasses) */}
              {!isSunglasses && (
                <div
                  onClick={() => handleSelectVision('bifocal')}
                  className={`p-3.5 border rounded-xs cursor-pointer transition-all flex items-start justify-between group ${
                    selectedVisionType === 'bifocal'
                      ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Bi-Focal D-Segment Illustration */}
                    <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-300 flex flex-col justify-between shrink-0 overflow-hidden relative shadow-xs">
                      <div className="w-full h-6 flex items-center justify-center bg-white/70">
                        <span className="text-[7px] font-extrabold text-neutral-600">DISTANCE</span>
                      </div>
                      {/* D-Segment Window */}
                      <div className="w-9 h-5 mx-auto bg-amber-200 border-t-2 border-amber-600 rounded-t-md flex items-center justify-center">
                        <span className="text-[7px] font-black text-amber-950">D-LINE</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-neutral-900">Bi-Focal</h4>
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded-xs">
                          Dual Power
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                        Distance on top with distinct visible D-segment window at bottom for reading. Two focal powers in one frame.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-neutral-500">
                        <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">Distinct D-Segment</span>
                        <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">Hard Multicoat</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-neutral-900 block">From ₹599</span>
                    <span className="text-[10px] text-neutral-400 line-through">₹1,199</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto mt-2" />
                  </div>
                </div>
              )}

              {/* Vision Option 3: Progressive */}
              <div
                onClick={() => handleSelectVision('progressive')}
                className={`p-3.5 border rounded-xs cursor-pointer transition-all flex items-start justify-between group ${
                  selectedVisionType === 'progressive'
                    ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Progressive Corridor Illustration */}
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-400 flex flex-col items-center justify-between p-1 shrink-0 relative overflow-hidden shadow-xs">
                    <span className="text-[6px] font-extrabold text-emerald-900">DIST</span>
                    <div className="w-7 h-2.5 bg-emerald-200 rounded text-[5.5px] font-black text-emerald-950 flex items-center justify-center">
                      COMPUTER
                    </div>
                    <span className="text-[6px] font-extrabold text-emerald-900">READING</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-neutral-900">
                        {isSunglasses ? 'Progressive UV400' : 'Progressive (Multifocal)'}
                      </h4>
                      <span className="bg-emerald-100 text-emerald-900 text-[9px] font-bold px-1.5 py-0.2 rounded-xs">
                        No Lines
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                      {isSunglasses
                        ? 'Seamless multi-distance focus (Distance, Intermediate & Reading) with UV400 sun protection & zero visible lines.'
                        : 'Seamless transition between Distance, Computer, and Reading vision with zero dividing lines. Natural eye movement.'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-neutral-500">
                      {isSunglasses ? (
                        <>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">Regular Progressive (₹2,999)</span>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">Prime Lenses GOA (₹4,799)</span>
                        </>
                      ) : (
                        <>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">No visible line</span>
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded-xs">German Freeform</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-neutral-900 block">
                    {isSunglasses ? 'From ₹2,999' : 'From ₹1,499'}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    {isSunglasses ? '₹5,999' : '₹2,999'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto mt-2" />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              LAYER 2: SELECT LENS PACKAGE & COATING (WITH 2X SLICED PRICES & VISUALS)
             ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight text-neutral-900">
                    {isSunglasses
                      ? (selectedVisionType === 'progressive' ? 'Sunglasses Progressive Options' : 'Sunglasses Single Vision Options')
                      : (selectedVisionType === 'bifocal' ? 'Bi-Focal Lens Options' : selectedVisionType === 'progressive' ? 'Progressive Lens Options' : 'Single Vision Lens Options')}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {isSunglasses
                      ? 'Select your prescription sun protection or high-precision Goa Prime freeform lenses'
                      : 'Select your coating, blue-cut protection, or photochromic adaptation'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-red-600 hover:text-red-700"
                >
                  Change Vision
                </button>
              </div>

              {/* Lens Package Cards */}
              <div className="space-y-2.5">
                {activeLensPackages
                  .filter((p) => p.id !== 'none')
                  .map((pkg) => {
                    const isSelected = tempLens.id === pkg.id;
                    const originalPrice = pkg.originalPrice || (pkg.price > 0 ? pkg.price * 2 : 0);

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => handleSelectPackage(pkg)}
                        className={`p-3.5 border rounded-xs cursor-pointer transition-all flex flex-col gap-2 relative ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-50 shadow-xs ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3">
                            {/* Graphic Representation Icon */}
                            <div className="w-11 h-11 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 shadow-2xs">
                              {pkg.id.includes('blu') ? (
                                <Laptop className="w-5 h-5 text-blue-600" />
                              ) : pkg.id.includes('photo') ? (
                                <Sun className="w-5 h-5 text-amber-600" />
                              ) : pkg.id.includes('bifocal') || pkg.id.includes('bf') ? (
                                <Glasses className="w-5 h-5 text-amber-700" />
                              ) : pkg.id.includes('prog') ? (
                                <Layers className="w-5 h-5 text-emerald-700" />
                              ) : (
                                <Shield className="w-5 h-5 text-neutral-700" />
                              )}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h4 className="font-bold text-xs text-neutral-900">{pkg.name}</h4>
                                {pkg.tag && (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-red-100 text-red-700 rounded-xs">
                                    {pkg.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-600 mt-1 leading-snug">
                                {pkg.description}
                              </p>
                            </div>
                          </div>

                          {/* 2X Sliced Down Pricing */}
                          <div className="text-right shrink-0">
                            <div className="flex items-baseline justify-end gap-1.5">
                              {originalPrice > pkg.price && (
                                <span className="text-xs text-neutral-400 line-through font-medium">
                                  ₹{originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="text-sm font-black text-neutral-900">
                                +₹{pkg.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                            {originalPrice > pkg.price && (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded-xs block mt-0.5">
                                50% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap gap-1.5 pl-14 pt-0.5">
                          {pkg.features.map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-xs font-medium border border-neutral-200/50"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* =========================================================================
              LAYER 3: REVIEW, PRESCRIPTION ASSURANCE & CONFIRMATION
             ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-2">
                <h3 className="font-black text-sm uppercase tracking-tight text-neutral-900">
                  Review Your Eyewear Package
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Confirm your customized frame and lens configuration
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-3">
                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Glasses className="w-4 h-4 text-neutral-700" />
                    <div>
                      <span className="font-bold text-neutral-900 block">{product.name}</span>
                      <span className="text-[11px] text-neutral-500">Premium Optical Frame</span>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900">
                    ₹{product.salePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="font-bold text-neutral-900 block">{tempLens.name}</span>
                      <span className="text-[11px] text-neutral-500">
                        {tempLens.shortDescription || 'Custom fitted lenses'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {tempLens.originalPrice && tempLens.originalPrice > tempLens.price && (
                      <span className="text-[10px] text-neutral-400 line-through block">
                        ₹{tempLens.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="font-bold text-neutral-900">
                      {tempLens.price > 0 ? `+₹${tempLens.price.toLocaleString('en-IN')}` : 'Included'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="font-black text-neutral-900 uppercase tracking-wider">Total Amount:</span>
                  <span className="font-black text-base text-neutral-900">
                    ₹{totalCalculatedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Prescription Power Assurance */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xs text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ℹ️
                  </span>
                  <span className="font-black text-amber-950 uppercase tracking-wide text-[11px]">
                    Prescription power collected post check-out
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed pl-7">
                  You don't need your prescription right now. Immediately after checkout, you can:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-7 pt-1 text-[10px] font-bold text-amber-950">
                  <div className="bg-white border border-amber-200 p-2 rounded-xs flex items-center gap-1.5 shadow-2xs">
                    <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Upload Doctor's Slip</span>
                  </div>
                  <div className="bg-white border border-amber-200 p-2 rounded-xs flex items-center gap-1.5 shadow-2xs">
                    <Eye className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Select Online Numbers</span>
                  </div>
                  <div className="bg-white border border-amber-200 p-2 rounded-xs flex items-center gap-1.5 shadow-2xs">
                    <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Free Store Eye Exam</span>
                  </div>
                </div>
              </div>

              {/* Lenses Included Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600">
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Year Lens Coating Warranty</span>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>14-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Bar */}
        <div className="p-4 border-t border-neutral-200 bg-white shrink-0 space-y-2">
          {currentStep < 3 ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Estimated Total</span>
                <span className="text-base font-black text-neutral-900">
                  ₹{(product.salePrice + (tempLens.price || 0)).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3))}
                className="flex-1 max-w-[240px] bg-neutral-900 hover:bg-neutral-950 text-white font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleFinalConfirm('cart')}
                className="w-full bg-neutral-900 hover:bg-neutral-950 text-white font-black text-xs sm:text-sm uppercase tracking-widest py-3.5 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm & Add to Cart • ₹{totalCalculatedPrice.toLocaleString('en-IN')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleFinalConfirm('checkout')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-widest py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Truck className="w-4 h-4 text-white" />
                <span>Proceed to Checkout (Fast COD)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
