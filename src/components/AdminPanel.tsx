import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Trash2, MessageSquare, Plus, FileText, CheckCircle, Eye, Settings } from 'lucide-react';
import { WriteModal } from './WriteModal';

export const AdminPanel: React.FC = () => {
  const {
    stories,
    photos,
    travels,
    friendPosts,
    libraryItems,
    notices,
    guestbooks,
    deleteStory,
    deletePhoto,
    deleteTravel,
    deleteFriendPost,
    deleteLibraryItem,
    deleteNotice,
    deleteGuestbook,
    replyGuestbook,
    showVisitorCount,
    setShowVisitorCount,
    todayVisitors,
    totalVisitors,
    adminPassword,
    changeAdminPassword,
    approveStory,
    approvePhoto,
    approveTravel,
    approveFriendPost,
    approveLibraryItem,
    approveNotice,
    approveGuestbook,
  } = useBlog();

  const [newPass, setNewPass] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'stories' | 'photos' | 'travels' | 'friend' | 'library' | 'notices' | 'guestbooks'>('stories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'story' | 'photo' | 'travel' | 'library' | 'notice'>('story');
  
  // Guestbook reply state
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleDelete = (id: string, type: string, action: () => void) => {
    if (window.confirm(`정말로 이 ${type}을(를) 영구히 삭제하시겠습니까?`)) {
      action();
      alert('삭제되었습니다.');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    changeAdminPassword(newPass);
    setNewPass('');
    alert('어드민 비밀번호가 성공적으로 변경되었습니다!');
  };

  const handleReplySubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    replyGuestbook(id, replyText);
    setReplyId(null);
    setReplyText('');
    alert('답변이 성공적으로 저장되었습니다.');
  };

  const subTabs = [
    { id: 'stories', label: '나의 이야기', count: stories.length, modalType: 'story' },
    { id: 'photos', label: '사진앨범', count: photos.length, modalType: 'photo' },
    { id: 'travels', label: '여행기', count: travels.length, modalType: 'travel' },
    { id: 'friend', label: '친구 소식', count: friendPosts.length, modalType: 'friend' },
    { id: 'library', label: '자료실', count: libraryItems.length, modalType: 'library' },
    { id: 'notices', label: '공지사항', count: notices.length, modalType: 'notice' },
    { id: 'guestbooks', label: '방명록', count: guestbooks.length },
  ] as const;

  const openAddModal = (type: 'story' | 'photo' | 'travel' | 'library' | 'notice') => {
    setModalType(type);
    setShowAddModal(true);
  };

  return (
    <div id="admin-panel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Introduction */}
      <div id="admin-header" className="border-b border-[#E6DED5] dark:border-[#3D3330] pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
            공방 관리자 제어판
          </h2>
          <p className="text-sm text-[#746D68] dark:text-[#9E958E] mt-1.5">
            홀치의 공방 홈페이지의 모든 콘텐츠를 관리하고 조율하는 소중한 전용 공간입니다.
          </p>
        </div>

        {/* Global Settings Controls */}
        <div id="admin-global-settings-controls" className="flex flex-col sm:flex-row gap-3">
          {/* Global Settings Trigger card */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#C69A52]/10 dark:bg-[#DFB775]/10 flex items-center justify-center text-[#C69A52]">
              <Settings size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#4B352D] dark:text-[#DFB775]">방문자 통계 노출</span>
                <input
                  id="visitor-count-visibility"
                  type="checkbox"
                  checked={showVisitorCount}
                  onChange={(e) => setShowVisitorCount(e.target.checked)}
                  className="w-4 h-4 text-[#C69A52] focus:ring-[#C69A52] border-[#E6DED5] rounded"
                />
              </div>
              <p className="text-[10px] text-[#746D68] dark:text-[#9E958E]">
                오늘 {todayVisitors} / 전체 {totalVisitors}명
              </p>
            </div>
          </div>

          {/* Admin Password Change Card */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-[#C69A52]/10 dark:bg-[#DFB775]/10 flex items-center justify-center text-[#C69A52]">
              <span className="text-sm">🔑</span>
            </div>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#4B352D] dark:text-[#DFB775]">관리자 비밀번호 변경</span>
              <div className="flex gap-1.5">
                <input
                  id="new-admin-password-input"
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-28 sm:w-32 h-7 px-2 border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] rounded-lg text-xs text-[#25211F] dark:text-white focus:outline-none"
                  required
                />
                <button
                  id="change-password-submit-btn"
                  type="submit"
                  className="px-2.5 h-7 rounded-lg bg-[#4B352D] dark:bg-[#DFB775] text-white dark:text-[#25201E] text-[10px] font-bold hover:opacity-90 cursor-pointer shrink-0"
                >
                  변경
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Grid Quick Dashboard Stats */}
      <div id="admin-stats-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] p-4 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">나의 이야기</p>
          <h4 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#DFB775] mt-1">{stories.length}개</h4>
        </div>
        <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] p-4 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">총 사진 수</p>
          <h4 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#DFB775] mt-1">{photos.length}개</h4>
        </div>
        <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] p-4 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">친구 소식글</p>
          <h4 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#DFB775] mt-1">{friendPosts.length}개</h4>
        </div>
        <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] p-4 rounded-2xl shadow-xs">
          <p className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">방명록 인사</p>
          <h4 className="font-display font-bold text-2xl text-[#4B352D] dark:text-[#DFB775] mt-1">{guestbooks.length}개</h4>
        </div>
      </div>

      {/* Horizontal SubTabs Navigation */}
      <div id="admin-subtabs" className="flex flex-wrap gap-1.5 border-b border-[#E6DED5] dark:border-[#3D3330] pb-3 mb-6">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            id={`subtab-${tab.id}`}
            onClick={() => {
              setActiveSubTab(tab.id);
              setReplyId(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#4B352D] text-white dark:bg-[#DFB775] dark:text-[#25201E]'
                : 'bg-white dark:bg-[#25201E] text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE]/60 dark:hover:bg-[#332B28]/60 border border-[#E6DED5] dark:border-[#3D3330]'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Primary Action Row (Add Button) */}
      <div id="admin-action-row" className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-base text-[#4B352D] dark:text-[#DFB775]">
          {subTabs.find((t) => t.id === activeSubTab)?.label} 목록 관리
        </h3>

        {activeSubTab !== 'friend' && activeSubTab !== 'guestbooks' && (
          <button
            id="admin-add-item-btn"
            onClick={() => {
              const currentTab = subTabs.find((t) => t.id === activeSubTab);
              if (currentTab && 'modalType' in currentTab && currentTab.modalType) {
                openAddModal(currentTab.modalType as any);
              }
            }}
            className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-[#C69A52] hover:bg-[#b0843e] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>새 항목 등록</span>
          </button>
        )}
      </div>

      {/* Content Table / Grid Area */}
      <div id="admin-table-container" className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl overflow-hidden shadow-xs">
        
        {/* SUBTAB 1: Stories */}
        {activeSubTab === 'stories' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#EEE7DE]/40 dark:bg-[#332B28]/35 border-b border-[#E6DED5] dark:border-[#3D3330]">
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">카테고리</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] min-w-[200px]">이야기 제목</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">날짜</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-center">조회 / 추천</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
                {stories.map((story) => (
                  <tr key={story.id} className="hover:bg-[#FAF8F4]/50 dark:hover:bg-[#1A1614]/20 transition-colors">
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#EEE7DE] dark:bg-[#332B28] text-xs font-semibold text-[#4B352D] dark:text-[#DFB775]">
                        {story.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#4B352D] dark:text-white truncate max-w-[280px]">
                      <div className="flex items-center gap-2">
                        {story.title}
                        {story.approved === false && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">승인 대기</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#746D68] dark:text-[#9E958E] font-mono">
                      {story.createdAt}
                    </td>
                    <td className="p-4 text-center text-xs font-mono text-[#746D68] dark:text-[#9E958E]">
                      👀 {story.views} / ❤️ {story.likes}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {story.approved === false && (
                          <button
                            onClick={() => {
                              approveStory(story.id);
                              alert('이야기가 성공적으로 승인되었습니다.');
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                            title="승인하기"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(story.id, '이야기', () => deleteStory(story.id))}
                          className="p-2 rounded-lg text-[#B74A45] hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 2: Photos */}
        {activeSubTab === 'photos' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#EEE7DE]/40 dark:bg-[#332B28]/35 border-b border-[#E6DED5] dark:border-[#3D3330]">
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">미리보기</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">사진 제목</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">설명</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">촬영일</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
                {photos.map((photo) => (
                  <tr key={photo.id} className="hover:bg-[#FAF8F4]/50 dark:hover:bg-[#1A1614]/20 transition-colors">
                    <td className="p-4">
                      <img
                        src={photo.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg border border-[#E6DED5] dark:border-[#3D3330]"
                      />
                    </td>
                    <td className="p-4 font-bold text-[#4B352D] dark:text-white truncate max-w-[150px]">
                      <div className="flex items-center gap-2">
                        {photo.title}
                        {photo.approved === false && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">승인 대기</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#746D68] dark:text-[#9E958E] max-w-[200px] truncate">
                      {photo.description}
                    </td>
                    <td className="p-4 text-xs text-[#746D68] dark:text-[#9E958E] font-mono">
                      {photo.takenAt}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {photo.approved === false && (
                          <button
                            onClick={() => {
                              approvePhoto(photo.id);
                              alert('사진이 성공적으로 승인되었습니다.');
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                            title="승인하기"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(photo.id, '사진', () => deletePhoto(photo.id))}
                          className="p-2 rounded-lg text-[#B74A45] hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 3: Travels */}
        {activeSubTab === 'travels' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#EEE7DE]/40 dark:bg-[#332B28]/35 border-b border-[#E6DED5] dark:border-[#3D3330]">
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">지역</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">여행기 제목</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">일정</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">태그</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
                {travels.map((travel) => (
                  <tr key={travel.id} className="hover:bg-[#FAF8F4]/50 dark:hover:bg-[#1A1614]/20 transition-colors">
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#EEE7DE] dark:bg-[#332B28] text-xs font-semibold text-[#4B352D] dark:text-[#DFB775]">
                        {travel.destination}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#4B352D] dark:text-white truncate max-w-[220px]">
                      <div className="flex items-center gap-2">
                        {travel.title}
                        {travel.approved === false && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">승인 대기</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#746D68] dark:text-[#9E958E] font-mono">
                      {travel.date}
                    </td>
                    <td className="p-4 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {travel.tags.map((tag) => (
                          <span key={tag} className="text-[10px] bg-[#FAF8F4] border border-[#E6DED5] dark:bg-[#1A1614] dark:border-[#3D3330] px-1.5 py-0.5 rounded text-[#746D68]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {travel.approved === false && (
                          <button
                            onClick={() => {
                              approveTravel(travel.id);
                              alert('여행기가 성공적으로 승인되었습니다.');
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                            title="승인하기"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(travel.id, '여행기', () => deleteTravel(travel.id))}
                          className="p-2 rounded-lg text-[#B74A45] hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 4: Friend Updates */}
        {activeSubTab === 'friend' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#EEE7DE]/40 dark:bg-[#332B28]/35 border-b border-[#E6DED5] dark:border-[#3D3330]">
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">작성자</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">친구소식 제목</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">날짜</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-center">댓글 수</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
                {friendPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#FAF8F4]/50 dark:hover:bg-[#1A1614]/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#4B352D] text-white text-[10px] font-bold flex items-center justify-center">
                          {post.nickname[0]}
                        </div>
                        <span className="font-semibold text-xs">{post.nickname}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#4B352D] dark:text-white truncate max-w-[240px]">
                      <div className="flex items-center gap-2">
                        {post.title}
                        {post.approved === false && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">승인 대기</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#746D68] dark:text-[#9E958E] font-mono">
                      {post.createdAt}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-[#C69A52] dark:text-[#DFB775]">
                      💬 {post.comments.length}개
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {post.approved === false && (
                          <button
                            onClick={() => {
                              approveFriendPost(post.id);
                              alert('친구 소식이 성공적으로 승인되었습니다.');
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                            title="승인하기"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(post.id, '친구 소식', () => deleteFriendPost(post.id))}
                          className="p-2 rounded-lg text-[#B74A45] hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 5: Library Resource */}
        {activeSubTab === 'library' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#EEE7DE]/40 dark:bg-[#332B28]/35 border-b border-[#E6DED5] dark:border-[#3D3330]">
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">구분</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">자료 제목</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">용량 크기</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">다운로드 수</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
                {libraryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F4]/50 dark:hover:bg-[#1A1614]/20 transition-colors">
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-[#C69A52]/10 text-[#C69A52] text-[10px] font-bold uppercase font-mono">
                        {item.fileType}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#4B352D] dark:text-white truncate max-w-[280px]">
                      <div className="flex items-center gap-2">
                        {item.title}
                        {item.approved === false && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">승인 대기</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-[#746D68] dark:text-[#9E958E]">
                      {item.fileSize}
                    </td>
                    <td className="p-4 font-mono text-xs text-center text-[#746D68] dark:text-[#9E958E]">
                      📥 {item.downloads}회
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.approved === false && (
                          <button
                            onClick={() => {
                              approveLibraryItem(item.id);
                              alert('자료실 항목이 성공적으로 승인되었습니다.');
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                            title="승인하기"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id, '자료 리소스', () => deleteLibraryItem(item.id))}
                          className="p-2 rounded-lg text-[#B74A45] hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 6: Notices */}
        {activeSubTab === 'notices' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#EEE7DE]/40 dark:bg-[#332B28]/35 border-b border-[#E6DED5] dark:border-[#3D3330]">
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">중요도</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">공지사항 제목</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775]">작성일</th>
                  <th className="p-4 font-semibold text-[#4B352D] dark:text-[#DFB775] text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
                {notices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-[#FAF8F4]/50 dark:hover:bg-[#1A1614]/20 transition-colors">
                    <td className="p-4">
                      {notice.isImportant ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#B74A45]/10 text-[#B74A45] text-[10px] font-bold">
                          ★ 중요공지
                        </span>
                      ) : (
                        <span className="text-[#746D68] text-xs">일반</span>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-[#4B352D] dark:text-white truncate max-w-[280px]">
                      <div className="flex items-center gap-2">
                        {notice.title}
                        {notice.approved === false && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">승인 대기</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-[#746D68] dark:text-[#9E958E]">
                      {notice.createdAt}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {notice.approved === false && (
                          <button
                            onClick={() => {
                              approveNotice(notice.id);
                              alert('공지사항이 성공적으로 승인되었습니다.');
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                            title="승인하기"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notice.id, '공지사항', () => deleteNotice(notice.id))}
                          className="p-2 rounded-lg text-[#B74A45] hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 7: Guestbook & Replies */}
        {activeSubTab === 'guestbooks' && (
          <div className="p-4 space-y-4">
            {guestbooks.length === 0 ? (
              <p className="text-center py-6 text-xs text-[#746D68]">작성된 방명록 글이 없습니다.</p>
            ) : (
              guestbooks.map((guest) => (
                <div key={guest.id} className="p-4 bg-[#FAF8F4] dark:bg-[#1A1614] rounded-2xl border border-[#E6DED5] dark:border-[#3D3330] space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm text-[#4B352D] dark:text-[#DFB775]">{guest.nickname}</span>
                      <span className="text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono ml-2">{guest.createdAt}</span>
                      {guest.approved === false && (
                        <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">승인 대기</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {guest.approved === false && (
                        <button
                          onClick={() => {
                            approveGuestbook(guest.id);
                            alert('방명록 글이 성공적으로 승인되었습니다.');
                          }}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                          title="승인하기"
                        >
                          <CheckCircle size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setReplyId(guest.id);
                          setReplyText(guest.adminReply || '');
                        }}
                        className="p-2 rounded-lg text-[#C69A52] hover:bg-[#EEE7DE] dark:hover:bg-[#332B28] cursor-pointer"
                        title="답변 추가/수정"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id, '방명록', () => deleteGuestbook(guest.id))}
                        className="p-2 rounded-lg text-[#B74A45] hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#25211F] dark:text-[#EBE6E1] leading-relaxed">
                    {guest.content}
                  </p>

                  {/* Reply Form */}
                  {replyId === guest.id && (
                    <form onSubmit={(e) => handleReplySubmit(e, guest.id)} className="mt-3 pt-3 border-t border-dashed border-[#E6DED5] dark:border-[#3D3330] space-y-2 animate-fade-in">
                      <label className="block text-[10px] font-bold text-[#C69A52] dark:text-[#DFB775]">
                        공방지기 답변 입력창
                      </label>
                      <textarea
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="정겨운 답변을 남겨보세요..."
                        className="w-full p-2.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#25201E] text-xs"
                        rows={2}
                      />
                      <div className="flex gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => setReplyId(null)}
                          className="px-3 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 text-[10px] font-bold"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-3.5 h-8 rounded-lg bg-[#4B352D] text-white text-[10px] font-bold"
                        >
                          답변 등록
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Registered Reply Display */}
                  {guest.adminReply && replyId !== guest.id && (
                    <div className="mt-3 p-3 rounded-xl bg-[#EEE7DE]/50 dark:bg-[#332B28]/45 border border-[#E6DED5]/70 dark:border-[#3D3330]/70 flex gap-2.5">
                      <span className="text-base">☕</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#4B352D] dark:text-[#DFB775]">공방지기 홀치</span>
                          <span className="px-1 py-0.2 bg-[#3F7D5A]/15 text-[#3F7D5A] text-[8px] font-bold rounded">답글완료</span>
                        </div>
                        <p className="text-xs text-[#25211F] dark:text-[#EBE6E1] leading-relaxed mt-0.5">
                          {guest.adminReply}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Editor Publishing Modals */}
      {showAddModal && (
        <WriteModal type={modalType} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};
