import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, Eye, Plus, Calendar } from 'lucide-react';
import { PhotoViewer } from './PhotoViewer';
import { WriteModal } from './WriteModal';

export const PhotoView: React.FC = () => {
  const { photos, searchQuery, setSearchQuery, isAdmin, imageFitMode } = useBlog();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter photos based on search query
  const filteredPhotos = photos.filter((photo) => {
    if (photo.approved === false && !isAdmin) return false;
    return (
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePhotoClick = (index: number) => {
    setPhotoIndex(index);
    setViewerOpen(true);
  };

  return (
    <div id="photo-album-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div id="photo-header" className="text-center space-y-3 mb-10">
        <h2 className="font-display font-bold text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
          추억 갤러리
        </h2>
        <p className="text-sm text-[#746D68] dark:text-[#9E958E] max-w-lg mx-auto leading-relaxed font-light">
          공방 마당의 사계절 풍경, 손으로 깎아 만든 아날로그 공예품, 사랑하는 친구들과 모닥불 가에서 나누었던 따뜻한 순간을 사진에 담았습니다.
        </p>
      </div>

      {/* Controller Controls */}
      <div id="photo-controls" className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E6DED5] dark:border-[#3D3330] pb-5 mb-8">
        <span className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">
          전체 사진 <b className="text-[#C69A52] font-mono">{filteredPhotos.length}</b>장
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="사진 제목/설명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 h-9 pl-9 pr-4 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#25201E] text-xs focus:outline-none focus:border-[#C69A52]"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#746D68]" />
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 h-9 bg-[#C69A52] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#b0843e] cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>사진 등록</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of photos */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#25201E] rounded-3xl border border-[#E6DED5] dark:border-[#3D3330]">
          <p className="text-sm text-[#746D68] dark:text-[#9E958E]">검색 조건에 맞는 사진이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(index)}
              className="group bg-white dark:bg-[#25201E] rounded-2xl overflow-hidden border border-[#E6DED5] dark:border-[#3D3330] cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-1"
            >
              <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full ${imageFitMode === 'contain' ? 'object-contain bg-[#FAF8F4] dark:bg-[#1A1614]' : 'object-cover'} transition-transform duration-700 group-hover:scale-105`}
                />
                
                {/* Floating Date Over Image */}
                <span className="absolute bottom-3 right-3 bg-black/45 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                  <Calendar size={9} />
                  {photo.takenAt}
                </span>

                {photo.approved === false && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-md shadow-sm">
                    승인 대기
                  </span>
                )}
              </div>

              {/* Title Card Info */}
              <div className="p-4 space-y-1">
                <h4 className="font-display font-bold text-sm sm:text-base text-[#4B352D] dark:text-white truncate group-hover:text-[#C69A52] transition-colors">
                  {photo.title}
                </h4>
                <p className="text-xs text-[#746D68] dark:text-[#9E958E] line-clamp-2 leading-relaxed font-light">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carousel fullviewer overlay */}
      {viewerOpen && (
        <PhotoViewer
          photos={filteredPhotos}
          currentIndex={photoIndex}
          onClose={() => setViewerOpen(false)}
          onNavigate={(idx) => setPhotoIndex(idx)}
        />
      )}

      {/* Editor Modal for admins */}
      {showAddModal && (
        <WriteModal type="photo" onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};
