import React from 'react';

interface LogoProps {
  variant?: 'default' | 'badge' | 'minimal' | 'white' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const SpecslookLogo: React.FC<LogoProps> = ({
  variant = 'default',
  className = '',
  size = 'md'
}) => {
  const isWhite = variant === 'white';

  // Height mappings matching standard Tailwind scale while preserving the natural 1080x431 aspect ratio
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-18 sm:h-20'
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;
  const imageSrc = isWhite ? '/shop-logopng-white.png' : '/shop-logopng.png';

  return (
    <div
      id="specslook-official-logo"
      className={`inline-flex items-center justify-center select-none ${className}`}
    >
      <img
        src={imageSrc}
        alt="Specslook - A Complete Eye wear Zone"
        className={`${selectedSizeClass} w-auto object-contain transition-transform duration-200 hover:scale-[1.02] ${
          isWhite ? 'brightness-0 invert filter' : ''
        }`}
        onError={(e) => {
          // Fallback to original uploaded logo if white variant has any loading issue
          const target = e.currentTarget;
          if (target.src !== window.location.origin + '/shop-logopng.png') {
            target.src = '/shop-logopng.png';
          }
        }}
      />
    </div>
  );
};
