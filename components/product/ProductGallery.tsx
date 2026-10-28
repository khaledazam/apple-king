'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Sparkles } from 'lucide-react';
import { PublicMediaItem } from '@/types/catalog';

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
  media?: PublicMediaItem[];
  selectedColor?: string;
}

export function ProductGallery({
  images,
  productTitle,
  media = [],
  selectedColor,
}: ProductGalleryProps) {
  // Determine if variant-specific photography exists for the selected color
  const colorMatchingMedia = selectedColor
    ? media.filter(
        (m) => m.colorKey && m.colorKey.trim().toLowerCase() === selectedColor.trim().toLowerCase()
      )
    : [];

  const hasColorSpecificImages = colorMatchingMedia.length > 0;

  // Active display image set
  const activeImages = hasColorSpecificImages
    ? colorMatchingMedia.map((m) => m.secureUrl || m.url)
    : images && images.length > 0
    ? images
    : ['/branding/iphone-18-hero.jpg'];

  const [selectedImage, setSelectedImage] = useState(activeImages[0]);

  // When selected color changes, switch immediately to its dedicated photography
  useEffect(() => {
    if (activeImages.length > 0) {
      setSelectedImage(activeImages[0]);
    }
  }, [selectedColor, hasColorSpecificImages]);

  return (
    <div className="space-y-4">
      {/* Main Large Display Frame */}
      <div className="relative aspect-square w-full rounded-3xl bg-[#0D0D0D] border border-neutral-800 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
        {/* Dynamic Color Match Badge */}
        {selectedColor && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/60 backdrop-blur-md text-[11px] font-medium text-neutral-300">
            {hasColorSpecificImages ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#D6AC63]" />
                <span>صور لون: {selectedColor}</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-400">صور تمثيلية للموديل ({selectedColor} متوفر)</span>
              </>
            )}
          </div>
        )}

        <Image
          src={selectedImage || activeImages[0]}
          alt={productTitle}
          fill
          priority
          className="object-contain object-center p-4 transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 550px"
        />
      </div>

      {/* Thumbnails Row */}
      {activeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {activeImages.map((img, idx) => {
            const isSelected = selectedImage === img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-2xl bg-[#0D0D0D] border-2 overflow-hidden p-2 transition-all min-w-[44px] min-h-[44px] ${
                  isSelected
                    ? 'border-[#D6AC63] ring-2 ring-[#D6AC63]/20 scale-105'
                    : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                }`}
                aria-label={`عرض الصورة ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productTitle} - صورة ${idx + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
