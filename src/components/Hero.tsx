import React from 'react';
import { useBlog } from '../context/BlogContext';

export const Hero: React.FC = () => {
  const { setActiveTab } = useBlog();

  const handleNav = (tabId: 'story' | 'photo' | 'guestbook') => {
    setActiveTab(tabId);
    window.scrollTo({
      top: tabId === 'story' ? 500 : 0,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="hero-section"
      className="relative w-full h-[65vh] sm:h-[70vh] lg:h-[75vh] flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      {/* Dark overlay for text readability */}
      <div id="hero-overlay" className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

      {/* Hero Content */}
      <div
        id="hero-content"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center gap-4 sm:gap-6"
      >
        {/* Subtle upper small text */}
        <span
          id="hero-badge"
          className="inline-block px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] sm:text-xs font-medium tracking-widest text-[#DFB775] uppercase animate-fade-in"
        >
          ✨ 오늘도 새로운 추억이 쌓이고 있습니다
        </span>

        {/* Main Title */}
        <h2
          id="hero-title"
          className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight select-none mt-2"
        >
          반갑습니다. <br className="sm:hidden" />
          <span className="text-[#DFB775]">Holechi's Studio</span>입니다.
        </h2>

        {/* Description & Addition */}
        <div className="max-w-2xl mx-auto space-y-2">
          <p
            id="hero-desc-1"
            className="text-sm sm:text-base md:text-lg text-[#EEE7DE] leading-relaxed font-light"
          >
            친구들과 추억을 나누고, 소소한 일상을 기록하며, 좋은 정보와 자료를 함께 나누는 공간입니다.
          </p>
          <p
            id="hero-desc-2"
            className="text-xs sm:text-sm text-[#DFB775]/95 font-medium tracking-wide"
          >
            “잠시 쉬어가듯 편안하게 둘러보세요.”
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          id="hero-cta-container"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-4 sm:mt-6"
        >
          <button
            id="hero-cta-story"
            onClick={() => handleNav('story')}
            className="w-full sm:w-auto px-6 h-12 rounded-xl bg-[#4B352D] hover:bg-[#3d2b24] text-white font-semibold text-sm tracking-wide transition-all duration-200 transform active:scale-95 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer border border-[#C69A52]"
          >
            최근 이야기 보기
          </button>
          
          <button
            id="hero-cta-photo"
            onClick={() => handleNav('photo')}
            className="w-full sm:w-auto px-6 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/35 text-white font-semibold text-sm tracking-wide transition-all duration-200 transform active:scale-95 backdrop-blur-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            사진앨범 둘러보기
          </button>
          
          <button
            id="hero-cta-guest"
            onClick={() => handleNav('guestbook')}
            className="w-full sm:w-auto px-6 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/35 text-white font-semibold text-sm tracking-wide transition-all duration-200 transform active:scale-95 backdrop-blur-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            방명록 남기기
          </button>
        </div>
      </div>
      
      {/* Decorative Wave/Bottom Gradient */}
      <div id="hero-bottom-shading" className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAF8F4] to-transparent dark:from-[#1A1614] pointer-events-none" />
    </section>
  );
};
