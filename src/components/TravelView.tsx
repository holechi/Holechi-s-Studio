import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, MapPin, Calendar, Tag, Plus, BookOpen } from 'lucide-react';
import { WriteModal } from './WriteModal';

export const TravelView: React.FC = () => {
  const { travels, searchQuery, setSearchQuery, isAdmin, imageFitMode } = useBlog();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(travels.flatMap((t) => t.tags))
  );

  // Filter logic
  const filteredTravels = travels.filter((travel) => {
    const matchesSearch =
      travel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      travel.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      travel.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || travel.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div id="travel-logs-view" className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Title */}
      <div id="travel-header" className="text-center space-y-3 mb-10">
        <h2 className="font-display font-bold text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
          여정의 발자취
        </h2>
        <p className="text-sm text-[#746D68] dark:text-[#9E958E] max-w-lg mx-auto leading-relaxed font-light">
          새로운 공기를 마시며 발길 닿는 곳마다 마주했던 따뜻한 빛과 푸른 바다, 고즈넉한 풍경 속 치유의 기록을 친구들과 공유합니다.
        </p>
      </div>

      {/* Controllers: Tags & Search */}
      <div id="travel-controls" className="space-y-4 border-b border-[#E6DED5] dark:border-[#3D3330] pb-6 mb-8">
        
        {/* Horizontal tag scroll list */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#746D68] dark:text-[#9E958E] mr-2 flex items-center gap-1 font-semibold">
            <Tag size={12} />
            해시태그:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
              !selectedTag
                ? 'bg-[#C69A52] text-white shadow-xs'
                : 'bg-white dark:bg-[#25201E] text-[#746D68] hover:bg-gray-100 dark:hover:bg-[#332B28]'
            }`}
          >
            #전체보기
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#C69A52] text-white shadow-xs'
                  : 'bg-white dark:bg-[#25201E] text-[#746D68] hover:bg-gray-100 dark:hover:bg-[#332B28] border border-[#E6DED5] dark:border-[#3D3330]'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">
            여행기 <b className="text-[#C69A52] font-mono">{filteredTravels.length}</b>개 기록됨
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="여행지, 내용 검색..."
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
                <span>여행지 추가</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Travel logs list */}
      {filteredTravels.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#25201E] rounded-3xl border border-[#E6DED5] dark:border-[#3D3330]">
          <p className="text-sm text-[#746D68] dark:text-[#9E958E]">검색 조건에 일치하는 여정이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredTravels.map((travel) => (
            <div
              key={travel.id}
              className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Cover Image */}
              <div className="md:w-5/12 relative min-h-[250px] md:min-h-auto overflow-hidden">
                <img
                  src={travel.imageUrl}
                  alt={travel.title}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full ${imageFitMode === 'contain' ? 'object-contain bg-zinc-100 dark:bg-zinc-800/50' : 'object-cover'} transition-transform duration-700 hover:scale-[1.03]`}
                />
                
                {/* Location overlay badge */}
                <span className="absolute top-4 left-4 bg-[#C69A52] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <MapPin size={11} />
                  <span>{travel.destination}</span>
                </span>
              </div>

              {/* Text fields */}
              <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#746D68] dark:text-[#9E958E] font-mono">
                    <Calendar size={13} />
                    <span>여정 일정: {travel.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#4B352D] dark:text-white leading-snug">
                    {travel.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light whitespace-pre-line">
                    {travel.content}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E6DED5]/70 dark:border-[#3D3330]/70">
                  <div className="flex flex-wrap gap-1.5">
                    {travel.tags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="text-[10px] font-semibold text-[#C69A52] bg-[#EEE7DE]/40 dark:bg-[#332B28] hover:bg-[#C69A52]/10 px-2.5 py-1 rounded-md cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <span className="text-[10px] font-mono text-[#746D68] dark:text-[#9E958E] uppercase tracking-widest font-bold flex items-center gap-1 bg-gray-50 dark:bg-[#1A1614] px-2 py-1 rounded-md border border-[#E6DED5]/60 dark:border-[#3D3330]/60">
                    <BookOpen size={10} />
                    {travel.destination}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {showAddModal && (
        <WriteModal type="travel" onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};
