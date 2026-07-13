import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Photo, Story, ActiveTab } from '../types';
import { PhotoViewer } from './PhotoViewer';
import { WriteModal } from './WriteModal';
import {
  FileText,
  File,
  Image as ImageIcon,
  FolderArchive,
  Video,
  FileCode,
  ArrowRight,
  Eye,
  Heart,
  MessageSquare,
  Bookmark,
  Sparkles,
  Download,
  Volume2,
  CheckCircle
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    stories,
    photos,
    travels,
    friendPosts,
    libraryItems,
    notices,
    guestbooks,
    setActiveTab,
    incrementStoryViews,
    likeStory,
    downloadLibraryItem,
  } = useBlog();

  // Photo viewer states
  const [viewerOpen, setViewerOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Write modal states
  const [writeType, setWriteType] = useState<'friend' | 'guestbook' | null>(null);

  // Helper for rendering library icons based on fileType
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="text-[#B74A45]" size={18} />;
      case 'doc':
        return <File className="text-blue-500" size={18} />;
      case 'image':
        return <ImageIcon className="text-emerald-500" size={18} />;
      case 'zip':
        return <FolderArchive className="text-amber-600" size={18} />;
      case 'video':
        return <Video className="text-purple-500" size={18} />;
      default:
        return <FileCode className="text-gray-500" size={18} />;
    }
  };

  const handleStoryClick = (id: string) => {
    incrementStoryViews(id);
    setActiveTab('story');
    setTimeout(() => {
      const el = document.getElementById(`story-card-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handlePhotoClick = (photo: Photo) => {
    const idx = photos.findIndex((p) => p.id === photo.id);
    if (idx !== -1) {
      setPhotoIndex(idx);
      setViewerOpen(true);
    }
  };

  const navigateTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sorted notices: important ones first
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return 0;
  });

  return (
    <div id="home-view" className="space-y-16 py-10">

      {/* SECTION 1: 오늘의 인사 (Today's Greeting) */}
      <section id="welcome-greeting" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl overflow-hidden shadow-xs flex flex-col md:flex-row items-stretch">
          
          {/* Left Column Image */}
          <div className="md:w-1/2 relative min-h-[250px] md:min-h-auto">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
              alt="Cozy Studio Interior"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Soft gold vignette */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#4B352D]/20 to-transparent" />
          </div>

          {/* Right Column Content */}
          <div className="md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center items-start gap-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C69A52] dark:text-[#DFB775]">
              <Sparkles size={14} />
              <span>오늘도 반갑습니다</span>
            </div>
            
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#4B352D] dark:text-[#EBE6E1] leading-tight">
              나무와 종이, 커피 향이 <br />
              머무는 편안한 안식처
            </h3>
            
            <p className="text-sm sm:text-base text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light">
              “평범한 하루의 작은 순간들을 기록합니다. 오래된 친구들과 소식을 나누고, 일상 생활과 가구 만들기에 도움이 되는 따뜻한 자료도 함께 공유하고 있습니다.”
            </p>
            
            <button
              id="goto-intro-btn"
              onClick={() => navigateTab('intro')}
              className="h-11 px-5 rounded-xl border border-[#C69A52] text-[#C69A52] hover:bg-[#C69A52]/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>공방 소개 및 위치 안내</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>


      {/* SECTION 2: 최근 이야기 (Recent Stories) */}
      <section id="recent-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52]">
              <Volume2 size={13} />
              <span>STORIES</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#EBE6E1] mt-1">
              최근 이야기
            </h3>
            <p className="text-xs text-[#746D68] dark:text-[#9E958E] mt-1">
              홀치의 공방에 새롭게 올라온 일상 소식들입니다.
            </p>
          </div>
          <button
            onClick={() => navigateTab('story')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52] hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
          >
            <span>전체 이야기 보기</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {stories.length === 0 ? (
          <p className="text-center py-10 text-xs text-[#746D68]">게시된 이야기가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Highlighted First Story */}
            <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl overflow-hidden shadow-xs flex flex-col lg:flex-row items-stretch card-hover">
              <div className="lg:w-1/2 relative min-h-[220px] lg:min-h-auto">
                <img
                  src={stories[0].imageUrl}
                  alt={stories[0].title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#C69A52] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase">
                  🏆 최신 이야기
                </span>
              </div>
              <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between items-start gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#C69A52]">{stories[0].category}</span>
                  <h4 className="font-display font-bold text-xl sm:text-2xl text-[#4B352D] dark:text-white leading-tight">
                    {stories[0].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed line-clamp-3 font-light">
                    {stories[0].content}
                  </p>
                </div>
                
                <div className="w-full flex items-center justify-between border-t border-[#E6DED5]/80 dark:border-[#3D3330]/80 pt-4">
                  <div className="flex items-center gap-3 text-[11px] text-[#746D68] dark:text-[#9E958E] font-mono">
                    <span>📅 {stories[0].createdAt}</span>
                    <span>👀 {stories[0].views}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeStory(stories[0].id);
                      }}
                      className="hover:text-red-500 flex items-center gap-0.5 cursor-pointer"
                    >
                      ❤️ {stories[0].likes}
                    </button>
                  </div>
                  <button
                    onClick={() => handleStoryClick(stories[0].id)}
                    className="h-9 px-4 rounded-lg bg-[#4B352D] hover:bg-[#3d2b24] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    자세히 읽기
                  </button>
                </div>
              </div>
            </div>

            {/* Remaining Stories */}
            {stories.slice(1, 6).map((story) => (
              <div
                key={story.id}
                className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl overflow-hidden flex flex-col justify-between card-hover"
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-[#4B352D]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {story.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h4 className="font-display font-bold text-base text-[#4B352D] dark:text-white leading-snug line-clamp-1">
                      {story.title}
                    </h4>
                    <p className="text-xs text-[#746D68] dark:text-[#9E958E] leading-relaxed line-clamp-2 font-light">
                      {story.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3.5 border-t border-[#E6DED5]/80 dark:border-[#3D3330]/80">
                    <div className="flex items-center gap-2.5 text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono">
                      <span>{story.createdAt}</span>
                      <span>👀 {story.views}</span>
                      <span>❤️ {story.likes}</span>
                    </div>
                    <button
                      onClick={() => handleStoryClick(story.id)}
                      className="text-xs font-bold text-[#C69A52] hover:text-[#4B352D]"
                    >
                      자세히 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 3: 사진으로 보는 최근 소식 (Recent Photos) */}
      <section id="recent-photos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52]">
              <span>GALLERY</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#EBE6E1] mt-1">
              사진으로 보는 이야기
            </h3>
            <p className="text-xs text-[#746D68] dark:text-[#9E958E] mt-1">
              사진 한 장에 담긴 아늑하고 소중한 순간들을 만나보세요.
            </p>
          </div>
          <button
            onClick={() => navigateTab('photo')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52] hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
          >
            <span>사진앨범 전체 보기</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {photos.length === 0 ? (
          <p className="text-center py-10 text-xs text-[#746D68]">등록된 앨범 사진이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.slice(0, 8).map((photo) => (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-xs cursor-pointer bg-zinc-800 border border-[#E6DED5] dark:border-[#3D3330]"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-[#4B352D]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <h4 className="font-display font-bold text-sm tracking-tight text-[#DFB775]">
                    {photo.title}
                  </h4>
                  <p className="text-[10px] text-white/80 line-clamp-2 mt-1 leading-normal font-light">
                    {photo.description}
                  </p>
                  <span className="text-[9px] font-mono text-white/50 mt-1.5">
                    📅 {photo.takenAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 4: 친구들의 최근 소식 (Friend Updates) */}
      <section id="friend-updates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52]">
              <span>FRIENDS</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#EBE6E1] mt-1">
              친구들의 최근 소식
            </h3>
            <p className="text-xs text-[#746D68] dark:text-[#9E958E] mt-1">
              멀리 있어도 정겨운 친구 소식 하나면 늘 곁에 있는 것처럼 가깝게 느껴집니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWriteType('friend')}
              className="px-4 h-9 rounded-xl bg-[#4B352D] hover:bg-[#3d2b24] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              친구 소식 남기기
            </button>
            <button
              onClick={() => navigateTab('friend')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52] hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
            >
              <span>전체 소식 보기</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {friendPosts.length === 0 ? (
          <div className="bg-white dark:bg-[#25201E] border border-dashed border-[#E6DED5] dark:border-[#3D3330] rounded-3xl p-12 text-center">
            <p className="text-sm text-[#746D68] dark:text-[#9E958E]">
              아직 등록된 친구 소식이 없습니다. 첫 번째 정겨운 소식을 남겨보세요.
            </p>
            <button
              onClick={() => setWriteType('friend')}
              className="mt-4 px-4 h-9 rounded-xl bg-[#C69A52] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              첫 소식 남기기 📝
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {friendPosts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl p-5 flex flex-col justify-between gap-4 card-hover"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#E6DED5]/50 dark:border-[#3D3330]/50 mb-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#4B352D] dark:bg-[#DFB775] text-white dark:text-[#25201E] font-bold text-sm flex items-center justify-center">
                        {post.nickname[0]}
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm">{post.nickname}</span>
                        <p className="text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono">{post.createdAt}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#C69A52]/10 text-[#C69A52] px-2 py-0.5 rounded font-bold">
                      친구글
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base text-[#4B352D] dark:text-white mb-2 line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed line-clamp-3 font-light mb-4">
                    {post.content}
                  </p>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover rounded-xl border border-[#E6DED5]/80"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#E6DED5]/50 dark:border-[#3D3330]/50 pt-3">
                  <div className="flex items-center gap-3 text-xs text-[#746D68] font-mono">
                    <span className="flex items-center gap-0.5 text-red-500">
                      ❤️ {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5 text-blue-500">
                      💬 {post.comments.length}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateTab('friend')}
                    className="text-xs font-semibold text-[#C69A52] hover:underline"
                  >
                    상세보기 & 댓글달기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 5: 여행 이야기 (Travel Logs) */}
      <section id="travel-logs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52]">
              <span>TRAVELS</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#EBE6E1] mt-1">
              여행의 기록
            </h3>
            <p className="text-xs text-[#746D68] dark:text-[#9E958E] mt-1">
              직접 다녀온 따뜻한 풍경 속 장소들과 영원히 기억하고 싶은 순간들을 담았습니다.
            </p>
          </div>
          <button
            onClick={() => navigateTab('travel')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52] hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
          >
            <span>여행기 전체 보기</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {travels.length === 0 ? (
          <p className="text-center py-10 text-xs text-[#746D68]">게시된 여행기가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travels.slice(0, 3).map((travel) => (
              <div
                key={travel.id}
                className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl overflow-hidden flex flex-col justify-between card-hover"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={travel.imageUrl}
                    alt={travel.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-[#C69A52] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    📍 {travel.destination}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono block">📅 {travel.date}</span>
                    <h4 className="font-display font-bold text-base text-[#4B352D] dark:text-white leading-snug line-clamp-1">
                      {travel.title}
                    </h4>
                    <p className="text-xs text-[#746D68] dark:text-[#9E958E] leading-relaxed line-clamp-3 font-light">
                      {travel.content}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {travel.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold text-[#C69A52] bg-[#EEE7DE]/40 dark:bg-[#332B28] px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTab('travel')}
                    className="w-full h-10 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] hover:bg-[#EEE7DE]/20 text-xs font-bold transition-all cursor-pointer"
                  >
                    여행기 전문 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 6: 인기 자료실 (Resource Library) */}
      <section id="library-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52]">
              <span>RESOURCES</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#EBE6E1] mt-1">
              함께 나누는 자료
            </h3>
            <p className="text-xs text-[#746D68] dark:text-[#9E958E] mt-1">
              가구 만들기 도안, 에스프레소 추출 레시피 등 일상에 유익한 자료를 편하게 나누어보세요.
            </p>
          </div>
          <button
            onClick={() => navigateTab('library')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52] hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
          >
            <span>자료실 전체 보기</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {libraryItems.length === 0 ? (
          <p className="text-center py-10 text-xs text-[#746D68]">공유된 자료가 없습니다.</p>
        ) : (
          <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
            {libraryItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#FAF8F4]/40 dark:hover:bg-[#1A1614]/10"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#1A1614] border border-[#E6DED5] dark:border-[#3D3330]">
                    {getFileIcon(item.fileType)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#4B352D] dark:text-white">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#746D68] dark:text-[#9E958E] mt-1">
                      <span className="uppercase font-bold text-[#C69A52]">{item.fileType}</span>
                      <span>•</span>
                      <span>용량: {item.fileSize}</span>
                      <span>•</span>
                      <span>등록일: {item.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-[#E6DED5]/50 pt-3.5 sm:pt-0">
                  <span className="text-xs text-[#746D68] dark:text-[#9E958E] font-mono">
                    📥 다운로드 <b>{item.downloads}</b>회
                  </span>
                  
                  <button
                    onClick={() => {
                      downloadLibraryItem(item.id);
                      alert(`[${item.title}] 가상 다운로드가 시작되었습니다. (용량: ${item.fileSize})`);
                    }}
                    className="h-10 px-4 rounded-xl bg-[#4B352D] hover:bg-[#3d2b24] text-white dark:bg-[#DFB775] dark:hover:bg-[#d2a760] dark:text-[#25201E] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} />
                    <span>내려받기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 7: 공지사항 (Notices) */}
      <section id="notice-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="font-display font-bold text-xl text-[#4B352D] dark:text-[#EBE6E1] mb-6">
          알려드립니다
        </h3>

        {notices.length === 0 ? (
          <p className="text-center py-10 text-xs text-[#746D68]">공지사항이 없습니다.</p>
        ) : (
          <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl divide-y divide-[#E6DED5] dark:divide-[#3D3330] shadow-2xs">
            {sortedNotices.slice(0, 4).map((notice) => (
              <div
                key={notice.id}
                onClick={() => {
                  setActiveTab('guestbook'); // Move to guestbook tab to view general notice
                  setTimeout(() => {
                    const el = document.getElementById(`notice-item-${notice.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F4]/50 dark:hover:bg-[#1A1614]/10 transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  {notice.isImportant ? (
                    <span className="shrink-0 text-[10px] bg-[#C69A52] text-white px-2 py-0.5 rounded font-bold">
                      📌 중요
                    </span>
                  ) : (
                    <span className="shrink-0 text-[10px] bg-gray-100 dark:bg-[#1A1614] text-gray-400 px-2 py-0.5 rounded font-bold font-mono">
                      NOTICE
                    </span>
                  )}
                  <span className="font-bold text-xs sm:text-sm text-[#4B352D] dark:text-white truncate">
                    {notice.title}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono">
                  <span>{notice.createdAt}</span>
                  <span className="text-emerald-500 font-bold bg-emerald-50 px-1 py-0.2 rounded text-[8px]">NEW</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 8: 방명록 미리보기 (Guestbook Preview) */}
      <section id="guestbook-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52]">
              <span>GUESTBOOK</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#EBE6E1] mt-1">
              따뜻한 한마디
            </h3>
            <p className="text-xs text-[#746D68] dark:text-[#9E958E] mt-1">
              정감 어린 짧은 방명록 인사 한마디는 공방지기에게 매우 소중하고 따뜻한 위안이 됩니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWriteType('guestbook')}
              className="px-4 h-9 rounded-xl bg-[#4B352D] hover:bg-[#3d2b24] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              방명록 남기기
            </button>
            <button
              onClick={() => navigateTab('guestbook')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#C69A52] hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
            >
              <span>방명록 전체 보기</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {guestbooks.length === 0 ? (
          <p className="text-center py-6 text-xs text-[#746D68]">작성된 방명록이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guestbooks.slice(0, 3).map((g) => (
              <div
                key={g.id}
                className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl p-5 flex flex-col justify-between gap-4 card-hover"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4B352D] dark:text-[#DFB775]">{g.nickname}</span>
                    <span className="text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono">{g.createdAt}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed line-clamp-3 font-light">
                    {g.content}
                  </p>
                </div>

                {g.adminReply ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg">
                    <CheckCircle size={12} />
                    <span>공방지기의 따뜻한 답변 도착</span>
                  </div>
                ) : (
                  <span className="text-[9px] text-gray-300 font-mono">답글 대기 중</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>


      {/* SECTION 9: 방문 안내 CTA (Bottom CTA) */}
      <section id="bottom-cta" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-center text-white bg-[#4B352D]">
          
          {/* Faded Background graphics */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#251A16] to-[#C69A52]/35 opacity-90" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              오늘의 소식을 함께 나눠주세요
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#EEE7DE] font-light leading-relaxed">
              “사진과 글로 당신의 소소한 안부를 편하게 전하고, <br />
              오래 기억하고 싶은 우리들의 따스한 청춘의 순간을 여기에 함께 남겨보세요.”
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => setWriteType('friend')}
                className="w-full sm:w-auto px-6 h-12 rounded-xl bg-white text-[#4B352D] font-bold text-xs sm:text-sm shadow-md hover:bg-[#FAF8F4] transition-colors cursor-pointer"
              >
                친구 소식 남기기 ✏️
              </button>
              <button
                onClick={() => setWriteType('guestbook')}
                className="w-full sm:w-auto px-6 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                방명록 인사 남기기 🏡
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Slide Gallery Modal */}
      {viewerOpen && (
        <PhotoViewer
          photos={photos}
          currentIndex={photoIndex}
          onClose={() => setViewerOpen(false)}
          onNavigate={(idx) => setPhotoIndex(idx)}
        />
      )}

      {/* Editor Modal */}
      {writeType && (
        <WriteModal type={writeType} onClose={() => setWriteType(null)} />
      )}

    </div>
  );
};
