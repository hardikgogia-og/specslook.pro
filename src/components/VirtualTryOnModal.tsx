import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  X,
  Sparkles,
  ShoppingBag,
  Download,
  Share2,
  Sliders,
  Check,
  ChevronRight,
  ChevronLeft,
  Sun,
  ShieldCheck,
  Maximize2,
  Minimize2,
  User,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Product } from '../types.ts';
import { useStore } from '../context/StoreContext.tsx';
import { GlassesOverlay } from './GlassesOverlay.tsx';

interface VirtualTryOnModalProps {
  initialProduct?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// Curated high-resolution model portraits for instant try-on without camera
interface ModelFace {
  id: string;
  name: string;
  faceShape: string;
  gender: string;
  image: string;
  defaultYOffset: number;
  defaultScale: number;
}

const SAMPLE_MODELS: ModelFace[] = [
  {
    id: 'female-oval',
    name: 'Aisha',
    faceShape: 'Oval Face',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    defaultYOffset: -12,
    defaultScale: 1.05
  },
  {
    id: 'male-square',
    name: 'Kabir',
    faceShape: 'Square Jawline',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    defaultYOffset: -18,
    defaultScale: 1.12
  },
  {
    id: 'female-round',
    name: 'Maya',
    faceShape: 'Round Face',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    defaultYOffset: -10,
    defaultScale: 1.02
  },
  {
    id: 'male-heart',
    name: 'Rohan',
    faceShape: 'Heart Face',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80',
    defaultYOffset: -14,
    defaultScale: 1.08
  },
  {
    id: 'female-cateye',
    name: 'Rhea',
    faceShape: 'Diamond / High Cheekbones',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
    defaultYOffset: -16,
    defaultScale: 1.04
  }
];

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  initialProduct,
  isOpen,
  onClose
}) => {
  const { products, addToCart, navigateTo, showToast, setIsCartOpen } = useStore();

  // Active Selected Product for Try-On
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => {
    return initialProduct || products[0] || ({} as Product);
  });

  // Camera & Mode States
  const [tryOnMode, setTryOnMode] = useState<'camera' | 'model'>('camera');
  const [selectedModel, setSelectedModel] = useState<ModelFace>(SAMPLE_MODELS[0]);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isMirrored, setIsMirrored] = useState(true);
  const [availableCamerasCount, setAvailableCamerasCount] = useState(1);

  // AR Alignment & Fitting Controls
  const [scale, setScale] = useState(1.0);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(-15);
  const [tilt, setTilt] = useState(0);
  const [tintDarkness, setTintDarkness] = useState<number | undefined>(undefined);
  const [customFrameColor, setCustomFrameColor] = useState<string | undefined>(undefined);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  // Catalog Filter for Try-On Switcher
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'Sunglasses' | 'Eyeglasses' | 'Attachments' | 'Men' | 'Women'>('all');

  // Captured Snapshot State
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dragging state for manual repositioning
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto face-tracking smoothed coordinates
  const trackedFaceRef = useRef<{
    x: number;
    y: number;
    scale: number;
    tilt: number;
    confidence: number;
  }>({
    x: 0,
    y: -15,
    scale: 1.0,
    tilt: 0,
    confidence: 0
  });

  // Synchronize when initialProduct prop changes
  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    } else if (products && products.length > 0 && !selectedProduct.id) {
      setSelectedProduct(products[0]);
    }
  }, [initialProduct, products]);

  // Enumerate video devices
  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setAvailableCamerasCount(videoDevices.length);
      }).catch(() => {});
    }
  }, []);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Real-time facial tracker loop
  const startFaceTracking = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check for native window.FaceDetector
    const NativeFaceDetector = (window as any).FaceDetector;
    let faceDetectorInstance: any = null;
    if (NativeFaceDetector) {
      try {
        faceDetectorInstance = new NativeFaceDetector({ maxDetectedFaces: 1, fastMode: true });
      } catch {}
    }

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const canvas = offscreenCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const trackFrame = async () => {
      if (!video || video.paused || video.ended || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(trackFrame);
        return;
      }

      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;

      if (faceDetectorInstance) {
        try {
          const faces = await faceDetectorInstance.detect(video);
          if (faces && faces.length > 0) {
            const face = faces[0];
            const bb = face.boundingBox;

            // Target normalized position relative to video center
            const centerX = bb.x + bb.width / 2;
            const eyeY = bb.y + bb.height * 0.32; // glasses align with eyes
            const deltaX = (centerX - videoWidth / 2) * (isMirrored ? -0.8 : 0.8);
            const deltaY = (eyeY - videoHeight / 2) * 0.8;

            // Head width scale estimate
            const rawScale = Math.min(1.4, Math.max(0.7, (bb.width / videoWidth) * 2.8));

            // Smooth interpolation (lerp)
            const current = trackedFaceRef.current;
            current.x += (deltaX - current.x) * 0.25;
            current.y += (deltaY - current.y) * 0.25;
            current.scale += (rawScale - current.scale) * 0.2;
            current.confidence = 1;

            // Update state smoothly
            setXOffset(Math.round(current.x));
            setYOffset(Math.round(current.y));
            setScale(parseFloat(current.scale.toFixed(2)));
          }
        } catch {
          // Fallback if native FaceDetector throws
        }
      } else if (ctx) {
        // Lightweight contrast/luminance center-of-gravity tracker
        try {
          const sampleW = 64;
          const sampleH = 48;
          canvas.width = sampleW;
          canvas.height = sampleH;
          ctx.drawImage(video, 0, 0, sampleW, sampleH);

          // Fast center-third eye-line feature check
          const imgData = ctx.getImageData(sampleW * 0.25, sampleH * 0.2, sampleW * 0.5, sampleH * 0.3);
          const data = imgData.data;
          let totalLum = 0;
          let weightedX = 0;
          let count = 0;

          for (let i = 0; i < data.length; i += 16) {
            const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            totalLum += lum;
            const pixelIdx = i / 4;
            const px = pixelIdx % (sampleW * 0.5);
            weightedX += px * (255 - lum);
            count++;
          }

          if (count > 0 && totalLum > 0) {
            const avgX = weightedX / count;
            const normX = (avgX / (sampleW * 0.5) - 0.5) * 40;
            const current = trackedFaceRef.current;
            current.x += (normX - current.x) * 0.15;
            setXOffset(Math.round(current.x));
          }
        } catch {}
      }

      animationFrameRef.current = requestAnimationFrame(trackFrame);
    };

    animationFrameRef.current = requestAnimationFrame(trackFrame);
  }, [isMirrored]);

  // Request & Start Camera
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setTryOnMode('model');
      return;
    }

    stopCamera();
    setCameraState('requesting');

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
          setCameraState('active');
          startFaceTracking();
        };
      } else {
        setCameraState('active');
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraState('denied');
      // If camera failed or denied, seamlessly switch to curated real model portraits
      setTryOnMode('model');
      showToast('Camera access unavailable. Switched to high-res Model Face Try-On!', 'info');
    }
  }, [cameraFacing, startFaceTracking, stopCamera, showToast]);

  // Start camera when modal opens in camera mode
  useEffect(() => {
    if (isOpen) {
      if (tryOnMode === 'camera') {
        startCamera();
      }
    } else {
      stopCamera();
      setCapturedSnapshot(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, tryOnMode, startCamera, stopCamera]);

  // Switch between Camera and Model mode
  const handleToggleMode = (mode: 'camera' | 'model') => {
    setTryOnMode(mode);
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
      // Apply model-specific default offsets for perfect instant fit
      setYOffset(selectedModel.defaultYOffset);
      setScale(selectedModel.defaultScale);
      setXOffset(0);
      setTilt(0);
    }
  };

  // Flip Camera (Front/Back)
  const handleFlipCamera = () => {
    setCameraFacing(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  // Switch Model Face
  const handleSelectModel = (model: ModelFace) => {
    setSelectedModel(model);
    setYOffset(model.defaultYOffset);
    setScale(model.defaultScale);
    setXOffset(0);
    setTilt(0);
  };

  // Reset Adjustments
  const handleResetAdjustments = () => {
    if (tryOnMode === 'model') {
      setYOffset(selectedModel.defaultYOffset);
      setScale(selectedModel.defaultScale);
    } else {
      setYOffset(-15);
      setScale(1.0);
    }
    setXOffset(0);
    setTilt(0);
    setTintDarkness(undefined);
    setCustomFrameColor(undefined);
    showToast('Adjustments reset to optimal alignment');
  };

  // Capture Snapshot
  const handleCaptureSnapshot = () => {
    setIsCapturing(true);
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    try {
      const exportCanvas = document.createElement('canvas');
      const exportWidth = 1080;
      const exportHeight = 1440;
      exportCanvas.width = exportWidth;
      exportCanvas.height = exportHeight;
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) return;

      // Draw background: camera feed or model image
      if (tryOnMode === 'camera' && videoRef.current) {
        const video = videoRef.current;
        ctx.save();
        if (isMirrored) {
          ctx.translate(exportWidth, 0);
          ctx.scale(-1, 1);
        }
        // Aspect ratio cover
        const vRatio = video.videoWidth / video.videoHeight;
        const cRatio = exportWidth / exportHeight;
        let sWidth, sHeight, sx, sy;
        if (vRatio > cRatio) {
          sHeight = video.videoHeight;
          sWidth = sHeight * cRatio;
          sx = (video.videoWidth - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = video.videoWidth;
          sHeight = sWidth / cRatio;
          sx = 0;
          sy = (video.videoHeight - sHeight) / 2;
        }
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, exportWidth, exportHeight);
        ctx.restore();
      } else {
        // Draw Model Image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedModel.image;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, exportWidth, exportHeight);
          finishComposite();
        };
        img.onerror = () => {
          finishComposite();
        };
        return;
      }

      finishComposite();

      function finishComposite() {
        if (!ctx) return;

        // Render Specslook Brand Watermark Banner at Top & Bottom
        // Top luxury header bar
        ctx.fillStyle = 'rgba(10, 10, 10, 0.75)';
        ctx.fillRect(0, 0, exportWidth, 120);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('SPECSLOOK', 50, 75);

        ctx.fillStyle = '#e5e7eb';
        ctx.font = '500 22px sans-serif';
        ctx.fillText('3D VIRTUAL TRY-ON ATELIER', 320, 75);

        // Bottom Product Card Overlay
        ctx.fillStyle = 'rgba(10, 10, 10, 0.85)';
        ctx.fillRect(40, exportHeight - 200, exportWidth - 80, 150);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 38px sans-serif';
        ctx.fillText(selectedProduct.name, 70, exportHeight - 130);

        ctx.fillStyle = '#e11d48';
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText(`₹${selectedProduct.salePrice.toLocaleString('en-IN')}`, 70, exportHeight - 75);

        if (selectedProduct.price > selectedProduct.salePrice) {
          ctx.fillStyle = '#9ca3af';
          ctx.font = '28px sans-serif';
          ctx.fillText(`MRP ₹${selectedProduct.price.toLocaleString('en-IN')}`, 280, exportHeight - 75);
        }

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('FREE EXPRESS HOME DELIVERY & COD AVAILABLE', 580, exportHeight - 75);

        const dataUrl = exportCanvas.toDataURL('image/png');
        setCapturedSnapshot(dataUrl);
        setIsCapturing(false);
      }
    } catch (e) {
      console.error('Snapshot error:', e);
      setIsCapturing(false);
    }
  };

  // Download snapshot image
  const handleDownloadSnapshot = () => {
    if (!capturedSnapshot) return;
    const link = document.createElement('a');
    link.href = capturedSnapshot;
    link.download = `specslook-tryon-${selectedProduct.slug || 'eyewear'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Try-on photo downloaded successfully!');
  };

  // Share snapshot or product link
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Specslook Virtual Try-On: ${selectedProduct.name}`,
          text: `Check out how I look wearing ${selectedProduct.name} on Specslook!`,
          url: `${window.location.origin}/#/product/${selectedProduct.slug}`
        });
        showToast('Shared successfully!');
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  // Add to Bag directly from Try-On
  const handleAddToCart = () => {
    addToCart(selectedProduct);
    showToast(`Added ${selectedProduct.name} to bag!`);
  };

  // Buy Now directly from Try-On
  const handleBuyNow = () => {
    addToCart(selectedProduct);
    onClose();
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  // Filter products for the bottom carousel
  const filteredProducts = products.filter(p => {
    if (catalogFilter === 'all') return true;
    if (catalogFilter === 'Sunglasses') return p.category === 'Sunglasses';
    if (catalogFilter === 'Eyeglasses') return p.category === 'Eyeglasses';
    if (catalogFilter === 'Attachments') return p.category === 'Attachments';
    if (catalogFilter === 'Men') return p.specifications?.gender === 'Men';
    if (catalogFilter === 'Women') return p.specifications?.gender === 'Women';
    return true;
  });

  // Touch/Mouse Drag to reposition glasses
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: xOffset,
      initY: yOffset
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setXOffset(dragStartRef.current.initX + dx);
    setYOffset(dragStartRef.current.initY + dy);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        initX: xOffset,
        initY: yOffset
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.startX;
    const dy = e.touches[0].clientY - dragStartRef.current.startY;
    setXOffset(dragStartRef.current.initX + dx);
    setYOffset(dragStartRef.current.initY + dy);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Flash effect when taking snapshot */}
      {flashEffect && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150 animate-out fade-out" />
      )}

      {/* Main Container */}
      <div
        ref={containerRef}
        className={`relative flex flex-col bg-neutral-950 text-white overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-6xl h-full md:h-[94vh] md:max-h-[920px] md:rounded-2xl md:border md:border-neutral-800 shadow-2xl'
        }`}
      >
        {/* ========================================================
            TOP BAR: Brand, Mode Switcher & Quick Actions
            ======================================================== */}
        <div className="shrink-0 h-16 px-4 sm:px-6 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-widest text-white uppercase">
                  Specslook
                </span>
                <span className="px-2 py-0.5 rounded-xs bg-red-600/20 text-red-500 font-bold text-[10px] uppercase tracking-wider border border-red-500/30">
                  3D Virtual Try-On
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Real-time facial geometry & optical frame fitting
              </p>
            </div>
          </div>

          {/* Mode Switcher: Live Webcam vs Model Face */}
          <div className="flex items-center bg-neutral-800/80 p-1 rounded-lg border border-neutral-700/60">
            <button
              onClick={() => handleToggleMode('camera')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                tryOnMode === 'camera'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>
            <button
              onClick={() => handleToggleMode('model')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                tryOnMode === 'model'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Model Faces</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors hidden sm:flex"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-colors"
              aria-label="Close Try-On"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            MIDDLE BODY: Interactive AR Viewport & Live Stream
            ======================================================== */}
        <div
          className="relative flex-1 bg-black flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* CAMERA FEED */}
          {tryOnMode === 'camera' && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover sm:object-contain transition-transform duration-200 ${
                  isMirrored ? '-scale-x-100' : ''
                }`}
              />

              {/* Camera Permission Requesting / Loading Screen */}
              {cameraState === 'requesting' && (
                <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
                  <div className="w-14 h-14 rounded-full border-2 border-red-600 border-t-transparent animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-white mb-1">Starting Your Camera...</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mb-4">
                    Please allow camera permission in your browser prompt to enable live face tracking.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% On-Device & Private. No footage is ever uploaded.</span>
                  </div>
                </div>
              )}

              {/* Camera Permission Denied Screen with Instant Model Fallback */}
              {cameraState === 'denied' && (
                <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 text-center z-20">
                  <div className="w-14 h-14 rounded-full bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mb-4">
                    <CameraOff className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Camera Access Blocked</h3>
                  <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
                    Camera permissions were declined or blocked in your browser. To enable live tracking, tap the lock/camera icon in your address bar and grant camera access, or continue with our studio models.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => startCamera()}
                      className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Try Camera Again</span>
                    </button>
                    <button
                      onClick={() => handleToggleMode('model')}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                    >
                      <User className="w-4 h-4" />
                      <span>Try On Model Faces (Instant)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODEL PHOTO MODE */}
          {tryOnMode === 'model' && (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={selectedModel.image}
                alt={selectedModel.name}
                className="w-full h-full object-cover sm:object-contain transition-opacity duration-300 pointer-events-none"
              />

              {/* Model Face Selector Floating Pill */}
              <div className="absolute top-4 left-4 z-20 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-xl p-2 max-w-xs shadow-xl hidden sm:block">
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-neutral-400 px-2 mb-1.5">
                  Select Face Profile
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {SAMPLE_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectModel(m)}
                      className={`flex flex-col items-center p-1 rounded-lg transition-all ${
                        selectedModel.id === m.id
                          ? 'ring-2 ring-red-600 bg-neutral-800'
                          : 'opacity-70 hover:opacity-100 hover:bg-neutral-800/60'
                      }`}
                    >
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                      />
                      <span className="text-[10px] font-bold text-white mt-1 truncate max-w-[48px]">
                        {m.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              LIVE GLASSES OVERLAY (Rendered on top of camera / model)
              ======================================================== */}
          {selectedProduct.id && (
            <GlassesOverlay
              product={selectedProduct}
              scale={scale}
              xOffset={xOffset}
              yOffset={yOffset}
              tilt={tilt}
              tintDarkness={tintDarkness}
              customFrameColor={customFrameColor}
              showReflection={true}
            />
          )}

          {/* Repositioning Hint Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs text-neutral-300 text-[10px] font-medium px-3 py-1 rounded-full border border-white/10 pointer-events-none flex items-center gap-1.5 shadow-md">
            <Sliders className="w-3 h-3 text-red-500" />
            <span>Drag frame or use sliders below to calibrate fit</span>
          </div>

          {/* Floating On-Screen Camera Controls */}
          {tryOnMode === 'camera' && cameraState === 'active' && (
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              {availableCamerasCount > 1 && (
                <button
                  onClick={handleFlipCamera}
                  title="Switch Camera (Front / Back)"
                  className="p-2.5 bg-neutral-900/80 backdrop-blur-md text-white hover:bg-neutral-800 rounded-full border border-neutral-700/60 shadow-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMirrored(!isMirrored)}
                title={isMirrored ? 'Disable Mirror' : 'Enable Mirror'}
                className={`p-2.5 rounded-full border backdrop-blur-md shadow-lg transition-colors ${
                  isMirrored
                    ? 'bg-red-600/80 border-red-500 text-white'
                    : 'bg-neutral-900/80 border-neutral-700/60 text-neutral-400 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SNAPSHOT PREVIEW MODAL */}
          {capturedSnapshot && (
            <div className="absolute inset-0 bg-neutral-950/95 z-40 flex flex-col items-center justify-center p-4 sm:p-6 animate-in zoom-in-95 duration-200">
              <div className="relative max-w-sm w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
                <img
                  src={capturedSnapshot}
                  alt="Try-On Look"
                  className="w-full h-auto object-cover"
                />

                <div className="p-4 bg-neutral-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedProduct.name}</h4>
                      <p className="text-xs font-black text-red-500">
                        ₹{selectedProduct.salePrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-xs border border-emerald-800/40">
                      Saved HD Look
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleDownloadSnapshot}
                      className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setCapturedSnapshot(null)}
                    className="w-full py-2 text-neutral-400 hover:text-white text-xs font-medium transition-colors"
                  >
                    Take Another Photo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            COLLAPSIBLE FINE-TUNING DRAWER (Scale, Bridge, Tilt, Tint)
            ======================================================== */}
        {isControlsOpen && (
          <div className="shrink-0 bg-neutral-900 border-t border-neutral-800 p-4 animate-in slide-in-from-bottom duration-200 z-20">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-black tracking-wider uppercase text-neutral-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  Custom Calibration & Lens Tint
                </span>
                <button
                  onClick={handleResetAdjustments}
                  className="text-[11px] font-bold text-red-400 hover:text-red-300 underline"
                >
                  Reset Auto-Fit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Scale / Frame Width */}
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Frame Scale</span>
                    <span className="font-bold text-white">{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.02"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Bridge Vertical Height */}
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Nose Bridge Height</span>
                    <span className="font-bold text-white">{yOffset}px</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="60"
                    step="2"
                    value={yOffset}
                    onChange={(e) => setYOffset(parseInt(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Tilt Rotation */}
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Tilt Angle</span>
                    <span className="font-bold text-white">{tilt}°</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={tilt}
                    onChange={(e) => setTilt(parseInt(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Lens Tint Darkness */}
                <div>
                  <div className="flex justify-between text-neutral-400 mb-1">
                    <span>Lens Darkness</span>
                    <span className="font-bold text-white">
                      {Math.round((tintDarkness ?? (selectedProduct.category === 'Sunglasses' ? 0.72 : 0.12)) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={tintDarkness ?? (selectedProduct.category === 'Sunglasses' ? 0.72 : 0.12)}
                    onChange={(e) => setTintDarkness(parseFloat(e.target.value))}
                    className="w-full accent-red-600 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Quick Frame Metal / Acetate Swatches */}
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-800/80">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Frame Finish:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Matte Black', color: '#171717', ring: 'ring-neutral-700' },
                    { name: 'Vintage Gold', color: '#d4af37', ring: 'ring-amber-500' },
                    { name: 'Titanium Silver', color: '#c0c0c0', ring: 'ring-slate-300' },
                    { name: 'Rose Gold', color: '#b76e79', ring: 'ring-rose-400' },
                    { name: 'Havana Tortoise', color: '#5a3825', ring: 'ring-amber-800' },
                    { name: 'Crystal Clear', color: 'rgba(235, 240, 245, 0.85)', ring: 'ring-sky-300' }
                  ].map(swatch => (
                    <button
                      key={swatch.name}
                      onClick={() => setCustomFrameColor(swatch.color)}
                      title={swatch.name}
                      className={`w-5 h-5 rounded-full border border-neutral-600 transition-transform ${
                        customFrameColor === swatch.color ? 'scale-125 ring-2 ' + swatch.ring : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: swatch.color }}
                    />
                  ))}
                  {customFrameColor && (
                    <button
                      onClick={() => setCustomFrameColor(undefined)}
                      className="text-[10px] text-neutral-400 hover:text-white underline ml-2"
                    >
                      Original
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            BOTTOM BAR: Selected Product Info, Snapshot CTA, & Catalog Slider
            ======================================================== */}
        <div className="shrink-0 bg-neutral-900 border-t border-neutral-800 z-30">
          {/* Active Product Bar */}
          <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/70">
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80'}
                alt={selectedProduct.name}
                className="w-12 h-12 rounded-lg bg-neutral-800 object-contain p-1 border border-neutral-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">{selectedProduct.name}</h3>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {selectedProduct.specifications?.frameShape}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-black text-base text-red-500">
                    ₹{selectedProduct.salePrice.toLocaleString('en-IN')}
                  </span>
                  {selectedProduct.price > selectedProduct.salePrice && (
                    <span className="text-xs text-neutral-500 line-through">
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-[10px] text-emerald-400 font-bold ml-1">
                    Free COD Available
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsControlsOpen(!isControlsOpen)}
                className={`p-2.5 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isControlsOpen
                    ? 'bg-neutral-800 border-neutral-600 text-white'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Calibrate</span>
              </button>

              <button
                onClick={handleCaptureSnapshot}
                disabled={isCapturing}
                className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg border border-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Take Photo with Glasses"
              >
                <Camera className="w-4 h-4 text-red-500" />
                <span className="hidden sm:inline">Snapshot</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-neutral-700"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-lg"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Catalog Filter Tabs & Horizontal Carousel */}
          <div className="px-4 sm:px-6 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Switch Eyewear ({filteredProducts.length} Available)
              </span>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {(['all', 'Sunglasses', 'Eyeglasses', 'Attachments', 'Men', 'Women'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setCatalogFilter(tab)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      catalogFilter === tab
                        ? 'bg-white text-neutral-950'
                        : 'text-neutral-400 hover:text-white bg-neutral-800/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Scrollable Frame Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-700">
              {filteredProducts.map(p => {
                const isSelected = selectedProduct.id === p.id;
                const img = p.images?.[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80';
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setTintDarkness(undefined);
                      setCustomFrameColor(undefined);
                    }}
                    className={`shrink-0 flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-950/30 ring-1 ring-red-600'
                        : 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    <img
                      src={img}
                      alt={p.name}
                      className="w-11 h-11 rounded-lg bg-neutral-800 object-contain p-1"
                    />
                    <div className="pr-2 max-w-[120px]">
                      <div className="text-[11px] font-bold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-red-500 font-extrabold">
                        ₹{p.salePrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[9px] text-neutral-400 uppercase tracking-wider truncate">
                        {p.specifications?.frameShape}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
