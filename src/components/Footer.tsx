import React from 'react';
import { useBlog } from '../context/BlogContext';
import { ActiveTab } from '../types';
import { Mail, Share2, Copy, Instagram, Bookmark, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    setActiveTab,
    todayVisitors,
    totalVisitors,
    showVisitorCount,
  } = useBlog();

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('홈페이지 링크가 클립보드에 복사되었습니다! 친구들에게 전해보세요 😊');
  };

  return (
    <footer
      id="footer-section"
      className="bg-[#EEE7DE]/60 dark:bg-[#151110] border-t border-[#E6DED5] dark:border-[#3D3330] pt-12 pb-24 lg:pb-12 text-[#746D68] dark:text-[#9E958E] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 pb-10 border-b border-[#E6DED5] dark:border-[#3D3330]/60">
          
          {/* Left Column: Branding */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4B352D] dark:bg-[#DFB775] flex items-center justify-center border border-[#C69A52]">
                <span className="font-display font-bold text-lg text-[#C69A52] dark:text-[#25201E]">HS</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#4B352D] dark:text-[#EBE6E1] leading-none">
                  홀치의 공방
                </h3>
                <p className="font-mono text-[9px] text-[#C69A52] dark:text-[#DFB775] tracking-widest font-semibold uppercase mt-1">
                  HOLCHI’S STUDIO
                </p>
              </div>
            </button>
            <p className="text-xs leading-relaxed max-w-sm font-light">
              “친구들과 추억을 나누고, 소소한 일상을 기록하며, 좋은 정보와 자료를 함께 나누는 따뜻한 개인 공방이자 감성 블로그입니다.”
            </p>
          </div>

          {/* Middle Column: Directory Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#4B352D] dark:text-[#DFB775] uppercase tracking-wider">
              빠른 찾기
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => handleTabClick('home')} className="hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left">홈 화면</button>
              <button onClick={() => handleTabClick('story')} className="hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left">나의 이야기</button>
              <button onClick={() => handleTabClick('photo')} className="hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left">사진 앨범</button>
              <button onClick={() => handleTabClick('friend')} className="hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left">친구 소식</button>
              <button onClick={() => handleTabClick('library')} className="hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left">자료 자료실</button>
              <button onClick={() => handleTabClick('guestbook')} className="hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left">소통 방명록</button>
              <button onClick={() => handleTabClick('intro')} className="hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left col-span-2">홈페이지 소개 & 오시는 길</button>
            </div>
          </div>

          {/* Right Column: Contact & Share utilities */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-[#4B352D] dark:text-[#DFB775] uppercase tracking-wider">
              공방 연락망 & 공유
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <a
                href="mailto:kchyun77@gmail.com"
                className="flex items-center gap-2 hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
              >
                <Mail size={14} />
                <span>kchyun77@gmail.com</span>
              </a>
              <button
                onClick={copyLinkToClipboard}
                className="flex items-center gap-2 hover:text-[#4B352D] dark:hover:text-[#EBE6E1] text-left cursor-pointer"
              >
                <Copy size={14} />
                <span>공방 홈페이지 주소 복사</span>
              </button>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] hover:text-[#C69A52] transition-colors" title="인스타그램">
                <Instagram size={14} />
              </a>
              <a href="https://blog.naver.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] hover:text-[#C69A52] transition-colors" title="네이버 블로그">
                <Bookmark size={14} />
              </a>
              <button onClick={copyLinkToClipboard} className="p-2 rounded-xl bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] hover:text-[#C69A52] transition-colors cursor-pointer" title="공유하기">
                <Share2 size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright & dynamic visitor stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium border-t border-[#E6DED5] dark:border-[#3D3330]/40 pt-6">
          <div className="text-center sm:text-left space-y-1">
            <p>Copyright © <b>HOLCHI’S STUDIO</b>. All rights reserved.</p>
            <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-mono">최근 업데이트: 2026-07-13</p>
          </div>

          {/* Visitor count conditional layout */}
          {showVisitorCount && (
            <div id="footer-visitors" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#FAF8F4]/90 dark:bg-[#1A1614]/90 border border-[#E6DED5] dark:border-[#3D3330] font-mono text-xs shadow-xs">
              <div className="flex items-center gap-1.5 text-[#3F7D5A]">
                <Globe size={13} className="animate-pulse" />
                <span>오늘 방문자:</span>
                <span className="font-bold">{todayVisitors}</span>
              </div>
              <div className="w-px h-3 bg-[#E6DED5] dark:bg-[#3D3330]" />
              <div className="flex items-center gap-1 text-[#746D68] dark:text-[#9E958E]">
                <span>전체 방문자:</span>
                <span className="font-bold">{totalVisitors}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </footer>
  );
};
