import React, { useState } from 'react';
import { Photo } from '../types';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface PhotoViewerProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [scale, setScale] = useState(1);
  const currentPhoto = photos[currentIndex];

  if (!currentPhoto) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1); // Reset zoom
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(prevIndex);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1); // Reset zoom
    const nextIndex = (currentIndex + 1) % photos.length;
    onNavigate(nextIndex);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
  };

  const handleOpenOriginal = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(currentPhoto.imageUrl, '_blank');
  };

  return (
    <div
      id="photo-viewer-overlay"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6 animate-fade-in text-white select-none"
      onClick={onClose}
    >
      {/* Top Toolbar */}
      <div id="viewer-top-toolbar" className="flex items-center justify-between w-full z-10">
        <div className="flex items-center gap-1 text-xs text-white/60 font-mono">
          <span className="font-bold text-white">{currentIndex + 1}</span>
          <span>/</span>
          <span>{photos.length}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="zoom-out-btn"
            onClick={handleZoomOut}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="축소"
          >
            <ZoomOut size={18} />
          </button>
          <button
            id="zoom-in-btn"
            onClick={handleZoomIn}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="확대"
          >
            <ZoomIn size={18} />
          </button>
          <button
            id="zoom-reset-btn"
            onClick={handleResetZoom}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="기본 크기"
          >
            <RotateCcw size={18} />
          </button>
          <button
            id="view-original-btn"
            onClick={handleOpenOriginal}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors hidden sm:block"
            title="원본 보기"
          >
            <Maximize2 size={18} />
          </button>
          <div className="w-px h-6 bg-white/25 mx-1 hidden sm:block" />
          <button
            id="viewer-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="닫기"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div
        id="viewer-main-stage"
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden"
      >
        {/* Left Arrow Button */}
        <button
          id="viewer-prev-arrow"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Center Image Container */}
        <div
          id="viewer-image-container"
          className="relative max-w-full max-h-[60vh] sm:max-h-[70vh] flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `scale(${scale})` }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            id="viewer-active-image"
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[60vh] sm:max-h-[70vh] object-contain rounded-lg shadow-2xl border border-white/5 pointer-events-none select-none"
          />
        </div>

        {/* Right Arrow Button */}
        <button
          id="viewer-next-arrow"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Bottom Photo Metadata Card */}
      <div
        id="viewer-bottom-meta"
        className="w-full max-w-2xl mx-auto bg-black/60 border border-white/10 rounded-2xl p-4 sm:p-5 text-center sm:text-left backdrop-blur-md z-10 mb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 border-b border-white/15 pb-2.5 mb-2.5">
          <h3 className="font-display font-bold text-base sm:text-lg text-[#DFB775]">
            {currentPhoto.title}
          </h3>
          <span className="text-[10px] font-mono tracking-wider text-white/50 bg-white/10 px-2 py-0.5 rounded-full font-medium">
            📸 촬영일: {currentPhoto.takenAt}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-light">
          {currentPhoto.description}
        </p>
      </div>
    </div>
  );
};
