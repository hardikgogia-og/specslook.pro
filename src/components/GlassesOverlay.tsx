import React from 'react';
import { Product } from '../types.ts';

export interface GlassesOverlayProps {
  product: Product;
  scale?: number; // scale multiplier, default 1.0
  xOffset?: number; // px offset X
  yOffset?: number; // px offset Y
  tilt?: number; // degrees
  tintDarkness?: number; // 0 (clear demo lens) to 1 (full dark sun lens)
  customFrameColor?: string; // override frame color
  customLensColor?: string; // override lens color
  showReflection?: boolean;
}

export const GlassesOverlay: React.FC<GlassesOverlayProps> = ({
  product,
  scale = 1.0,
  xOffset = 0,
  yOffset = 0,
  tilt = 0,
  tintDarkness,
  customFrameColor,
  customLensColor,
  showReflection = true
}) => {
  const shape = (product.specifications?.frameShape || 'Wayfarer').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const isSunglasses = category.includes('sunglass') || product.specifications?.isPolarized;

  // Resolve default tint based on category if not explicitly controlled
  const defaultTint = isSunglasses ? 0.72 : 0.12;
  const effectiveTint = typeof tintDarkness === 'number' ? tintDarkness : defaultTint;

  // Resolve frame color
  const getFrameColor = () => {
    if (customFrameColor) return customFrameColor;
    const name = (product.name + ' ' + (product.description || '')).toLowerCase();
    if (name.includes('gold')) return '#d4af37';
    if (name.includes('rose gold') || name.includes('pink')) return '#b76e79';
    if (name.includes('silver') || name.includes('titanium') || name.includes('chrome')) return '#c0c0c0';
    if (name.includes('gunmetal') || name.includes('grey') || name.includes('gray')) return '#4a4a4a';
    if (name.includes('tortoise') || name.includes('havana') || name.includes('brown')) return '#5a3825';
    if (name.includes('crystal') || name.includes('clear') || name.includes('transparent')) return 'rgba(230, 235, 240, 0.7)';
    if (name.includes('blue')) return '#1e3a8a';
    if (name.includes('green') || name.includes('emerald')) return '#14532d';
    return '#171717'; // default luxury matte black
  };

  const frameColor = getFrameColor();

  // Resolve lens gradient
  const getLensFill = () => {
    if (customLensColor) return customLensColor;
    const name = (product.name + ' ' + (product.description || '')).toLowerCase();
    if (name.includes('green') || name.includes('g-15') || name.includes('g15')) {
      return `url(#lensGradientG15)`;
    }
    if (name.includes('blue') || name.includes('ocean')) {
      return `url(#lensGradientBlue)`;
    }
    if (name.includes('brown') || name.includes('amber') || name.includes('sunset')) {
      return `url(#lensGradientAmber)`;
    }
    if (name.includes('rose') || name.includes('pink')) {
      return `url(#lensGradientRose)`;
    }
    if (name.includes('silver') || name.includes('mirror')) {
      return `url(#lensGradientMirror)`;
    }
    return `url(#lensGradientSmoke)`;
  };

  const lensFill = getLensFill();

  // Determine frame shape type
  const isAviator = shape.includes('aviator') || shape.includes('pilot');
  const isRound = shape.includes('round') || shape.includes('circle');
  const isClubmaster = shape.includes('clubmaster') || shape.includes('browline');
  const isCatEye = shape.includes('cat');
  const isHexagonal = shape.includes('hex') || shape.includes('geometric');
  const isSquare = shape.includes('square');
  const isRectangular = shape.includes('rect') || (!isAviator && !isRound && !isClubmaster && !isCatEye && !isHexagonal && !isSquare);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-75"
      style={{
        transform: `translate(${xOffset}px, ${yOffset}px) rotate(${tilt}deg) scale(${scale})`,
        transformOrigin: 'center center'
      }}
    >
      <svg
        viewBox="0 0 400 160"
        className="w-[280px] sm:w-[320px] md:w-[360px] h-auto drop-shadow-2xl overflow-visible"
        style={{
          filter: 'drop-shadow(0 12px 16px rgba(0, 0, 0, 0.45)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
        }}
      >
        <defs>
          {/* Lens Gradients */}
          <linearGradient id="lensGradientSmoke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#111827" stopOpacity={effectiveTint * 1.1} />
            <stop offset="60%" stopColor="#1f2937" stopOpacity={effectiveTint * 0.95} />
            <stop offset="100%" stopColor="#374151" stopOpacity={effectiveTint * 0.75} />
          </linearGradient>

          <linearGradient id="lensGradientG15" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1b382b" stopOpacity={effectiveTint * 1.1} />
            <stop offset="70%" stopColor="#244d3b" stopOpacity={effectiveTint * 0.9} />
            <stop offset="100%" stopColor="#2d5f49" stopOpacity={effectiveTint * 0.75} />
          </linearGradient>

          <linearGradient id="lensGradientBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity={effectiveTint * 1.1} />
            <stop offset="100%" stopColor="#0284c7" stopOpacity={effectiveTint * 0.8} />
          </linearGradient>

          <linearGradient id="lensGradientAmber" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" stopOpacity={effectiveTint * 1.15} />
            <stop offset="60%" stopColor="#b45309" stopOpacity={effectiveTint * 0.9} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={effectiveTint * 0.65} />
          </linearGradient>

          <linearGradient id="lensGradientRose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#831843" stopOpacity={effectiveTint * 1.1} />
            <stop offset="100%" stopColor="#db2777" stopOpacity={effectiveTint * 0.75} />
          </linearGradient>

          <linearGradient id="lensGradientMirror" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" stopOpacity={effectiveTint * 1.2} />
            <stop offset="45%" stopColor="#cbd5e1" stopOpacity={effectiveTint * 1.1} />
            <stop offset="55%" stopColor="#94a3b8" stopOpacity={effectiveTint * 1.0} />
            <stop offset="100%" stopColor="#1e293b" stopOpacity={effectiveTint * 1.2} />
          </linearGradient>

          {/* Diagonal Glass Specular Reflection Highlight */}
          <linearGradient id="glassGlare" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="75%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Anti-reflective purple-blue coat shimmer for clear eyeglasses */}
          <linearGradient id="arCoatHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>

          {/* Metallic Frame Sheen */}
          <linearGradient id="metallicSheen" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ========================================================
            AVIATOR SILHOUETTE (Teardrop, Double Brow Bar, Slim Temples)
            ======================================================== */}
        {isAviator && (
          <g id="aviator-frame">
            {/* Extended Temple hinges */}
            <path d="M 28 58 L 54 58" stroke={frameColor} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 372 58 L 346 58" stroke={frameColor} strokeWidth="4.5" strokeLinecap="round" />

            {/* Top Brow Bar */}
            <path
              d="M 68 46 Q 200 42 332 46"
              stroke={frameColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 68 46 Q 200 42 332 46"
              stroke="url(#metallicSheen)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Lower Nose Bridge */}
            <path
              d="M 172 65 Q 200 60 228 65"
              stroke={frameColor}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Clear Silicone Nose Pads */}
            <ellipse cx="180" cy="74" rx="3.5" ry="6" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />
            <ellipse cx="220" cy="74" rx="3.5" ry="6" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />

            {/* Left Teardrop Lens */}
            <path
              d="M 64 56 C 62 88, 70 128, 114 130 C 158 132, 175 106, 174 65 C 173 50, 150 48, 115 48 C 80 48, 65 50, 64 56 Z"
              fill={lensFill}
            />
            {/* Left Lens Glare */}
            {showReflection && (
              <path
                d="M 64 56 C 62 88, 70 128, 114 130 C 158 132, 175 106, 174 65 C 173 50, 150 48, 115 48 C 80 48, 65 50, 64 56 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Left Rim */}
            <path
              d="M 64 56 C 62 88, 70 128, 114 130 C 158 132, 175 106, 174 65 C 173 50, 150 48, 115 48 C 80 48, 65 50, 64 56 Z"
              stroke={frameColor}
              strokeWidth="4"
              fill="none"
            />

            {/* Right Teardrop Lens */}
            <path
              d="M 336 56 C 338 88, 330 128, 286 130 C 242 132, 225 106, 226 65 C 227 50, 250 48, 285 48 C 320 48, 335 50, 336 56 Z"
              fill={lensFill}
            />
            {/* Right Lens Glare */}
            {showReflection && (
              <path
                d="M 336 56 C 338 88, 330 128, 286 130 C 242 132, 225 106, 226 65 C 227 50, 250 48, 285 48 C 320 48, 335 50, 336 56 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Right Rim */}
            <path
              d="M 336 56 C 338 88, 330 128, 286 130 C 242 132, 225 106, 226 65 C 227 50, 250 48, 285 48 C 320 48, 335 50, 336 56 Z"
              stroke={frameColor}
              strokeWidth="4"
              fill="none"
            />
          </g>
        )}

        {/* ========================================================
            WAYFARER SILHOUETTE (Bold Acetate, Diamond Rivets, Trapezoid)
            ======================================================== */}
        {(!isAviator && !isRound && !isClubmaster && !isCatEye && !isHexagonal && !isSquare) && (
          <g id="wayfarer-frame">
            {/* Outer Temple Hinges */}
            <path d="M 22 52 L 48 54" stroke={frameColor} strokeWidth="8" strokeLinecap="round" />
            <path d="M 378 52 L 352 54" stroke={frameColor} strokeWidth="8" strokeLinecap="round" />

            {/* Bridge */}
            <path
              d="M 174 57 Q 200 52 226 57"
              stroke={frameColor}
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Keyhole notch under bridge */}
            <path
              d="M 188 64 Q 200 68 212 64"
              stroke={frameColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Left Trapezoid Lens */}
            <path
              d="M 52 52 L 172 56 L 164 122 C 160 128, 148 132, 126 132 C 90 132, 60 126, 56 120 Z"
              fill={lensFill}
            />
            {showReflection && (
              <path
                d="M 52 52 L 172 56 L 164 122 C 160 128, 148 132, 126 132 C 90 132, 60 126, 56 120 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Left Thick Acetate Rim */}
            <path
              d="M 48 50 L 176 54 L 167 124 C 162 131, 148 135, 126 135 C 88 135, 56 129, 52 122 Z"
              stroke={frameColor}
              strokeWidth="8"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Right Trapezoid Lens */}
            <path
              d="M 348 52 L 228 56 L 236 122 C 240 128, 252 132, 274 132 C 310 132, 340 126, 344 120 Z"
              fill={lensFill}
            />
            {showReflection && (
              <path
                d="M 348 52 L 228 56 L 236 122 C 240 128, 252 132, 274 132 C 310 132, 340 126, 344 120 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Right Thick Acetate Rim */}
            <path
              d="M 352 50 L 224 54 L 233 124 C 238 131, 252 135, 274 135 C 312 135, 344 129, 348 122 Z"
              stroke={frameColor}
              strokeWidth="8"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Iconic Silver Diamond Corner Rivets */}
            <polygon points="40,51 43,49 46,51 43,53" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
            <polygon points="360,51 357,49 354,51 357,53" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
          </g>
        )}

        {/* ========================================================
            ROUND / CIRCULAR SILHOUETTE (Classic Heritage, Minimal Wire)
            ======================================================== */}
        {isRound && (
          <g id="round-frame">
            {/* Outer Temples */}
            <path d="M 34 76 L 62 76" stroke={frameColor} strokeWidth="4" strokeLinecap="round" />
            <path d="M 366 76 L 338 76" stroke={frameColor} strokeWidth="4" strokeLinecap="round" />

            {/* Arched Bridge */}
            <path
              d="M 166 76 Q 200 62 234 76"
              stroke={frameColor}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Nose Pads */}
            <ellipse cx="178" cy="85" rx="3" ry="5" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />
            <ellipse cx="222" cy="85" rx="3" ry="5" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />

            {/* Left Round Lens & Rim */}
            <circle cx="114" cy="84" r="50" fill={lensFill} />
            {showReflection && <circle cx="114" cy="84" r="50" fill="url(#glassGlare)" />}
            <circle cx="114" cy="84" r="50" stroke={frameColor} strokeWidth="5" fill="none" />

            {/* Right Round Lens & Rim */}
            <circle cx="286" cy="84" r="50" fill={lensFill} />
            {showReflection && <circle cx="286" cy="84" r="50" fill="url(#glassGlare)" />}
            <circle cx="286" cy="84" r="50" stroke={frameColor} strokeWidth="5" fill="none" />
          </g>
        )}

        {/* ========================================================
            CLUBMASTER / BROWLINE (Bold Brow, Slender Wire Rim)
            ======================================================== */}
        {isClubmaster && (
          <g id="clubmaster-frame">
            {/* Slender gold/metal bridge */}
            <path
              d="M 170 65 Q 200 58 230 65"
              stroke="#d4af37"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Clear Silicone Nose Pads */}
            <ellipse cx="180" cy="74" rx="3" ry="5.5" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />
            <ellipse cx="220" cy="74" rx="3" ry="5.5" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />

            {/* Left Lens */}
            <path
              d="M 66 58 C 66 58, 172 58, 172 65 C 172 108, 154 126, 118 126 C 82 126, 66 108, 66 65 Z"
              fill={lensFill}
            />
            {showReflection && (
              <path
                d="M 66 58 C 66 58, 172 58, 172 65 C 172 108, 154 126, 118 126 C 82 126, 66 108, 66 65 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Left Slim Gold Wire Bottom Rim */}
            <path
              d="M 66 65 C 66 108, 82 126, 118 126 C 154 126, 172 108, 172 65"
              stroke="#d4af37"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Left Heavy Brow Acetate Bar */}
            <path
              d="M 44 54 C 54 48, 114 46, 174 54 L 172 66 C 124 58, 70 60, 52 64 Z"
              fill={frameColor}
            />

            {/* Right Lens */}
            <path
              d="M 334 58 C 334 58, 228 58, 228 65 C 228 108, 246 126, 282 126 C 318 126, 334 108, 334 65 Z"
              fill={lensFill}
            />
            {showReflection && (
              <path
                d="M 334 58 C 334 58, 228 58, 228 65 C 228 108, 246 126, 282 126 C 318 126, 334 108, 334 65 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Right Slim Gold Wire Bottom Rim */}
            <path
              d="M 228 65 C 228 108, 246 126, 282 126 C 318 126, 334 108, 334 65"
              stroke="#d4af37"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Right Heavy Brow Acetate Bar */}
            <path
              d="M 356 54 C 346 48, 286 46, 226 54 L 228 66 C 276 58, 330 60, 348 64 Z"
              fill={frameColor}
            />

            {/* Silver Corner Studs */}
            <circle cx="50" cy="56" r="2" fill="#e5e7eb" />
            <circle cx="350" cy="56" r="2" fill="#e5e7eb" />
          </g>
        )}

        {/* ========================================================
            CAT-EYE SILHOUETTE (Upswept Wingtips, Glamorous Silhouette)
            ======================================================== */}
        {isCatEye && (
          <g id="cateye-frame">
            {/* Center Bridge */}
            <path
              d="M 174 60 Q 200 52 226 60"
              stroke={frameColor}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Left Cat-Eye Lens */}
            <path
              d="M 44 42 C 60 48, 120 54, 172 58 C 170 102, 142 128, 114 128 C 76 128, 52 96, 44 42 Z"
              fill={lensFill}
            />
            {showReflection && (
              <path
                d="M 44 42 C 60 48, 120 54, 172 58 C 170 102, 142 128, 114 128 C 76 128, 52 96, 44 42 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Left Winged Rim */}
            <path
              d="M 38 38 C 58 46, 122 52, 176 56 C 172 106, 144 132, 114 132 C 72 132, 46 98, 38 38 Z"
              stroke={frameColor}
              strokeWidth="7"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Right Cat-Eye Lens */}
            <path
              d="M 356 42 C 340 48, 280 54, 228 58 C 230 102, 258 128, 286 128 C 324 128, 348 96, 356 42 Z"
              fill={lensFill}
            />
            {showReflection && (
              <path
                d="M 356 42 C 340 48, 280 54, 228 58 C 230 102, 258 128, 286 128 C 324 128, 348 96, 356 42 Z"
                fill="url(#glassGlare)"
              />
            )}
            {/* Right Winged Rim */}
            <path
              d="M 362 38 C 342 46, 278 52, 224 56 C 228 106, 256 132, 286 132 C 328 132, 354 98, 362 38 Z"
              stroke={frameColor}
              strokeWidth="7"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}

        {/* ========================================================
            HEXAGONAL / GEOMETRIC (Modern Multi-Faceted Wire)
            ======================================================== */}
        {isHexagonal && (
          <g id="hexagonal-frame">
            {/* Arched Bridge */}
            <path
              d="M 168 70 Q 200 58 232 70"
              stroke={frameColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Nose pads */}
            <ellipse cx="178" cy="78" rx="3" ry="5.5" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />
            <ellipse cx="222" cy="78" rx="3" ry="5.5" fill="rgba(255,255,255,0.7)" stroke="#888" strokeWidth="0.75" />

            {/* Left Hexagon */}
            <polygon
              points="84,48 144,48 168,78 148,124 80,124 60,78"
              fill={lensFill}
            />
            {showReflection && (
              <polygon
                points="84,48 144,48 168,78 148,124 80,124 60,78"
                fill="url(#glassGlare)"
              />
            )}
            <polygon
              points="84,48 144,48 168,78 148,124 80,124 60,78"
              stroke={frameColor}
              strokeWidth="4.5"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Right Hexagon */}
            <polygon
              points="316,48 256,48 232,78 252,124 320,124 340,78"
              fill={lensFill}
            />
            {showReflection && (
              <polygon
                points="316,48 256,48 232,78 252,124 320,124 340,78"
                fill="url(#glassGlare)"
              />
            )}
            <polygon
              points="316,48 256,48 232,78 252,124 320,124 340,78"
              stroke={frameColor}
              strokeWidth="4.5"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}

        {/* ========================================================
            SQUARE / MODERN GEOMETRIC
            ======================================================== */}
        {isSquare && (
          <g id="square-frame">
            <path
              d="M 172 60 Q 200 54 228 60"
              stroke={frameColor}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Square Lens */}
            <rect x="58" y="52" width="112" height="74" rx="10" fill={lensFill} />
            {showReflection && <rect x="58" y="52" width="112" height="74" rx="10" fill="url(#glassGlare)" />}
            <rect x="58" y="52" width="112" height="74" rx="10" stroke={frameColor} strokeWidth="6" fill="none" />

            {/* Right Square Lens */}
            <rect x="230" y="52" width="112" height="74" rx="10" fill={lensFill} />
            {showReflection && <rect x="230" y="52" width="112" height="74" rx="10" fill="url(#glassGlare)" />}
            <rect x="230" y="52" width="112" height="74" rx="10" stroke={frameColor} strokeWidth="6" fill="none" />
          </g>
        )}

        {/* Subtle Specslook laser etched signature branding on top-left lens edge */}
        <text
          x="72"
          y="62"
          fontSize="5"
          fontFamily="sans-serif"
          fontWeight="900"
          letterSpacing="0.8"
          fill="rgba(255, 255, 255, 0.45)"
          className="select-none"
        >
          SPECSLOOK
        </text>
      </svg>
    </div>
  );
};
