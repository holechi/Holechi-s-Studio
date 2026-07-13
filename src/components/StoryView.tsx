import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Heart, Eye, MessageSquare, Search, Award } from 'lucide-react';
import { WriteModal } from './WriteModal';

export const StoryView: React.FC = () => {
  const {
    stories,
    searchQuery,
    setSearchQuery,
    likeStory,
    incrementStoryViews,
    isAdmin,
  } = useBlog();

  const [selectedCategory, setSelectedCategory] = useState<'전체' | '일상' | '취미' | '생각' | '소식'>('전체');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);

  // Filter logic
  const filteredStories = stories.filter((story) => {
    const matchesCategory = selectedCategory === '전체' || story.category === selectedCategory;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleExpand = (id: string) => {
    if (expandedStoryId === id) {
      setExpandedStoryId(null);
    } else {
      setExpandedStoryId(id);
      incrementStoryViews(id);
    }
  };

  const categories = ['전체', '일상', '취미', '생각', '소식'] as const;

  return (
    <div id="story-view" className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Tab Header & Title */}
      <div id="story-header" className="text-center space-y-3 mb-10">
        <h2 className="font-display font-bold text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
          이야기 공방
        </h2>
        <p className="text-sm text-[#746D68] dark:text-[#9E958E] max-w-lg mx-auto leading-relaxed font-light">
          나무 냄새 가득한 공간에서 묵묵히 써내려간 일상의 조각, 소소한 생각, 그리고 따뜻한 온기가 묻어나는 취미 기록입니다.
        </p>
      </div>

      {/* Categories & Search Controls */}
      <div id="story-controls" className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E6DED5] dark:border-[#3D3330] pb-5 mb-8">
        
        {/* Categories Flex */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#4B352D] text-white dark:bg-[#DFB775] dark:text-[#25201E]'
                  : 'bg-white dark:bg-[#25201E] text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE]/40 dark:hover:bg-[#332B28]/40 border border-[#E6DED5] dark:border-[#3D3330]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input and Admin write button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="이야기 본문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 h-9 pl-9 pr-4 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#25201E] text-xs focus:outline-none focus:border-[#C69A52]"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#746D68]" />
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 h-9 bg-[#C69A52] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#b0843e] cursor-pointer shrink-0"
            >
              글쓰기 ✏️
            </button>
          )}
        </div>
      </div>

      {/* Feed List */}
      <div id="story-feed" className="space-y-8">
        {filteredStories.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#25201E] rounded-3xl border border-[#E6DED5] dark:border-[#3D3330]">
            <p className="text-sm text-[#746D68] dark:text-[#9E958E]">
              검색 조건에 맞는 공방 이야기가 존재하지 않습니다.
            </p>
          </div>
        ) : (
          filteredStories.map((story) => {
            const isExpanded = expandedStoryId === story.id;
            return (
              <article
                key={story.id}
                id={`story-card-${story.id}`}
                className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl overflow-hidden shadow-xs transition-all duration-300"
              >
                {/* Header Image */}
                <div className="h-64 sm:h-80 w-full overflow-hidden relative">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                  <span className="absolute top-4 left-4 bg-[#4B352D] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                    {story.category}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-[#746D68] dark:text-[#9E958E] font-mono">
                    <span>📅 {story.createdAt}</span>
                    <span>•</span>
                    <span>👀 조회수 {story.views}회</span>
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#4B352D] dark:text-white leading-tight">
                    {story.title}
                  </h3>

                  {/* Body Text: collapse/expand logic */}
                  <div className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light whitespace-pre-line">
                    {isExpanded ? (
                      story.content
                    ) : (
                      <>
                        {story.content.slice(0, 150)}
                        {story.content.length > 150 && '...'}
                      </>
                    )}
                  </div>

                  {/* Interactive Button row */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E6DED5]/80 dark:border-[#3D3330]/80">
                    <button
                      onClick={() => likeStory(story.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:scale-105 transition-transform bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Heart size={14} className="fill-current" />
                      <span>추천 {story.likes}</span>
                    </button>

                    <button
                      onClick={() => handleToggleExpand(story.id)}
                      className="text-xs font-bold text-[#C69A52] hover:text-[#4B352D] border-b border-[#C69A52] pb-0.5"
                    >
                      {isExpanded ? '간략히 접기' : '이야기 전문 읽기'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Write Modal popup */}
      {showAddModal && (
        <WriteModal type="story" onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};
