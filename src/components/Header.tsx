import React, { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { ActiveTab } from '../types';
import { Menu, X, Sun, Moon, Search, LogIn, LogOut, Info, Settings, BookOpen, Image as ImageIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    darkMode,
    setDarkMode,
    isAdmin,
    setIsAdmin,
    imageFitMode,
    setImageFitMode,
    adminPassword,
  } = useBlog();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError('');
      alert('관리자 모드로 로그인되었습니다.');
    } else {
      setLoginError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('관리자 모드에서 로그아웃하시겠습니까?')) {
      setIsAdmin(false);
      if (activeTab === 'admin') {
        setActiveTab('home');
      }
    }
  };

  const menuItems = [
    { id: 'home', label: '홈' },
    { id: 'story', label: '이야기' },
    { id: 'photo', label: '사진앨범' },
    { id: 'travel', label: '여행기' },
    { id: 'friend', label: '친구소식' },
    { id: 'library', label: '자료실' },
    { id: 'guestbook', label: '방명록' },
    { id: 'intro', label: '소개' },
  ] as const;

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Header */}
      <header
        id="top-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'h-16 bg-white/80 dark:bg-[#25201E]/80 shadow-md backdrop-blur-md'
            : 'h-20 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <button
            id="header-logo-btn"
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4B352D] dark:bg-[#DFB775] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105 border border-[#C69A52] dark:border-[#25201E]">
              <span className="font-display font-bold text-lg text-[#C69A52] dark:text-[#25201E]">
                HS
              </span>
            </div>
            <div>
              <h1 className="font-display font-bold text-base sm:text-lg leading-tight text-[#4B352D] dark:text-[#EBE6E1] tracking-tight">
                홀치의 공방
              </h1>
              <p className="font-mono text-[9px] sm:text-[10px] text-[#C69A52] dark:text-[#DFB775] tracking-widest font-semibold uppercase">
                Holechi's Studio
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-[#C69A52] bg-[#EEE7DE]/60 dark:bg-[#332B28] font-bold'
                    : 'text-[#746D68] hover:text-[#4B352D] dark:text-[#9E958E] dark:hover:text-[#EBE6E1] hover:bg-[#EEE7DE]/20 dark:hover:bg-[#332B28]/30'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Utilities (Search, Theme, Admin) */}
          <div id="header-utilities" className="flex items-center gap-2">
            
            {/* Search toggler */}
            <div className="relative flex items-center">
              {showSearchInput && (
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="공방 소식 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 sm:w-48 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#25201E] focus:outline-none focus:border-[#C69A52] dark:focus:border-[#DFB775] mr-2 text-[#25211F] dark:text-[#EBE6E1]"
                />
              )}
              <button
                id="search-toggle-btn"
                onClick={() => {
                  setShowSearchInput(!showSearchInput);
                  if (showSearchInput) setSearchQuery('');
                }}
                className="p-2 rounded-lg text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE]/50 dark:hover:bg-[#332B28]/50 transition-colors"
                title="통합 검색"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Image Fit Mode toggle */}
            <button
              id="image-fit-toggle-btn"
              onClick={() => setImageFitMode(imageFitMode === 'cover' ? 'contain' : 'cover')}
              className={`p-2 h-9 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                imageFitMode === 'contain'
                  ? 'text-[#C69A52] bg-[#EEE7DE]/60 dark:bg-[#332B28] font-bold border border-[#C69A52]/20'
                  : 'text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE]/50 dark:hover:bg-[#332B28]/50'
              }`}
              title={imageFitMode === 'cover' ? '사진 전체보기 (안 짤리게)' : '사진 꽉 채워보기'}
            >
              <ImageIcon size={16} />
              <span className="text-[10px] sm:text-[11px] font-semibold">
                {imageFitMode === 'contain' ? '전체비율' : '꽉채우기'}
              </span>
            </button>

            {/* Dark Mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE]/50 dark:hover:bg-[#332B28]/50 transition-colors"
              title={darkMode ? '라이트모드 켜기' : '다크모드 켜기'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Authentication Button */}
            {isAdmin ? (
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B74A45] text-[#B74A45] hover:bg-[#B74A45]/10 text-xs font-semibold cursor-pointer"
                title="관리자 로그아웃"
              >
                <LogOut size={14} />
                <span>어드민</span>
              </button>
            ) : (
              <button
                id="admin-login-trigger-btn"
                onClick={() => setShowLoginModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C69A52] text-[#C69A52] dark:border-[#DFB775] dark:text-[#DFB775] hover:bg-[#C69A52]/10 text-xs font-semibold cursor-pointer"
              >
                <LogIn size={14} />
                <span>관리자</span>
              </button>
            )}

            {/* Admin panel navigation if logged in */}
            {isAdmin && (
              <button
                id="admin-panel-nav-btn"
                onClick={() => handleTabClick('admin')}
                className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#C69A52] text-white'
                    : 'bg-[#EEE7DE] dark:bg-[#332B28] text-[#4B352D] dark:text-[#DFB775]'
                }`}
              >
                <Settings size={14} />
                관리판
              </button>
            )}

            {/* Mobile hamburger menu */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 lg:hidden rounded-lg text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE]/50 dark:hover:bg-[#332B28]/50 transition-colors"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Side Menu overlay) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-overlay"
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
        >
          {/* Backdrop */}
          <div
            id="mobile-drawer-backdrop"
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu Card */}
          <div
            id="mobile-drawer-content"
            className="relative w-72 h-full bg-white dark:bg-[#25201E] p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E6DED5] dark:border-[#3D3330]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#4B352D] flex items-center justify-center">
                    <span className="font-display font-bold text-xs text-[#C69A52]">HS</span>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-sm text-[#4B352D] dark:text-[#EBE6E1]">
                      홀치의 공방
                    </h2>
                  </div>
                </div>
                <button
                  id="mobile-drawer-close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#746D68] dark:text-[#9E958E]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Menu Links */}
              <nav id="mobile-drawer-nav" className="mt-6 flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      activeTab === item.id
                        ? 'bg-[#EEE7DE] text-[#4B352D] dark:bg-[#332B28] dark:text-[#DFB775] font-bold'
                        : 'text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE]/30 dark:hover:bg-[#332B28]/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Admin direct link inside mobile drawer */}
                {isAdmin && (
                  <button
                    id="mobile-nav-admin"
                    onClick={() => handleTabClick('admin')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                      activeTab === 'admin'
                        ? 'bg-[#C69A52] text-white font-bold'
                        : 'text-[#4B352D] dark:text-[#DFB775] hover:bg-[#EEE7DE]/30 dark:hover:bg-[#332B28]/30'
                    }`}
                  >
                    <Settings size={16} />
                    관리자 대시보드
                  </button>
                )}
              </nav>
            </div>

            {/* Mobile login status at bottom of drawer */}
            <div className="pt-6 border-t border-[#E6DED5] dark:border-[#3D3330]">
              {isAdmin ? (
                <button
                  id="mobile-drawer-logout-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-[#B74A45] font-semibold text-sm cursor-pointer"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              ) : (
                <button
                  id="mobile-drawer-login-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#EEE7DE] dark:bg-[#332B28] text-[#4B352D] dark:text-[#DFB775] font-semibold text-sm cursor-pointer"
                >
                  <LogIn size={16} />
                  관리자 로그인
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation Bar for Mobile App Feeling */}
      <div
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#25201E]/95 border-t border-[#E6DED5] dark:border-[#3D3330] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md pb-safe"
      >
        <div className="h-16 flex items-center justify-around px-2">
          <button
            id="mobile-bottom-home"
            onClick={() => handleTabClick('home')}
            className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
              activeTab === 'home' ? 'text-[#C69A52]' : 'text-[#746D68] dark:text-[#9E958E]'
            }`}
          >
            <span className="text-[10px] uppercase font-mono font-bold">HOME</span>
            <span className="text-xs font-semibold mt-0.5">홈</span>
          </button>
          
          <button
            id="mobile-bottom-story"
            onClick={() => handleTabClick('story')}
            className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
              activeTab === 'story' ? 'text-[#C69A52]' : 'text-[#746D68] dark:text-[#9E958E]'
            }`}
          >
            <BookOpen size={18} className="stroke-[2.5]" />
            <span className="text-[10px] font-semibold mt-0.5">이야기</span>
          </button>

          <button
            id="mobile-bottom-photo"
            onClick={() => handleTabClick('photo')}
            className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
              activeTab === 'photo' ? 'text-[#C69A52]' : 'text-[#746D68] dark:text-[#9E958E]'
            }`}
          >
            <span className="w-5 h-5 rounded-md border-2 border-current flex items-center justify-center text-[10px] font-bold">P</span>
            <span className="text-[10px] font-semibold mt-0.5">사진</span>
          </button>

          <button
            id="mobile-bottom-friend"
            onClick={() => handleTabClick('friend')}
            className={`flex flex-col items-center justify-center w-14 h-full transition-colors ${
              activeTab === 'friend' ? 'text-[#C69A52]' : 'text-[#746D68] dark:text-[#9E958E]'
            }`}
          >
            <span className="text-sm font-bold">👥</span>
            <span className="text-[10px] font-semibold mt-0.5">친구소식</span>
          </button>

          <button
            id="mobile-bottom-more"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-14 h-full text-[#746D68] dark:text-[#9E958E]"
          >
            <Menu size={18} />
            <span className="text-[10px] font-semibold mt-0.5">더보기</span>
          </button>
        </div>
      </div>

      {/* Admin Login Dialog Modal */}
      {showLoginModal && (
        <div
          id="login-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div
            id="login-modal-content"
            className="w-full max-w-sm bg-white dark:bg-[#25201E] rounded-2xl p-6 shadow-2xl border border-[#E6DED5] dark:border-[#3D3330] relative animate-fade-in"
          >
            <button
              id="login-modal-close-btn"
              onClick={() => {
                setShowLoginModal(false);
                setLoginError('');
              }}
              className="absolute top-4 right-4 text-[#746D68] dark:text-[#9E958E] hover:text-[#4B352D] dark:hover:text-[#EBE6E1]"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#4B352D] flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="font-display font-bold text-sm text-[#C69A52]">HS</span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#4B352D] dark:text-[#EBE6E1]">
                관리자 모드 접속
              </h3>
              <p className="text-xs text-[#746D68] dark:text-[#9E958E] mt-1">
                스튜디오 콘텐츠 추가 및 관리를 위해 비밀번호를 입력하세요.
              </p>
            </div>

            <form onSubmit={handleLogin} id="login-form" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                  관리 비밀번호
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] text-[#25211F] dark:text-[#EBE6E1] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 focus:border-[#C69A52] text-sm"
                  autoFocus
                  required
                />
              </div>

              {loginError && (
                <p id="login-error-msg" className="text-xs text-red-500 font-medium">
                  {loginError}
                </p>
              )}

              <button
                id="login-submit-btn"
                type="submit"
                className="w-full h-11 rounded-xl bg-[#4B352D] hover:bg-[#3d2b24] dark:bg-[#DFB775] dark:hover:bg-[#d2a760] text-white dark:text-[#25201E] font-semibold text-sm tracking-wide transition-colors shadow-md mt-2 cursor-pointer"
              >
                접속하기
              </button>
            </form>
            <div className="mt-4 pt-4 border-t border-[#E6DED5] dark:border-[#3D3330] text-center">
              <span className="text-[10px] text-[#746D68] dark:text-[#9E958E]">
                {adminPassword === '1234' ? (
                  <>
                    기본 설정 비밀번호는 <code className="bg-[#EEE7DE] dark:bg-[#332B28] px-1.5 py-0.5 rounded text-[#4B352D] dark:text-[#DFB775] font-mono">1234</code> 입니다.
                  </>
                ) : (
                  <span className="text-[#C69A52] font-semibold">설정된 관리자 비밀번호로 로그인하세요.</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
