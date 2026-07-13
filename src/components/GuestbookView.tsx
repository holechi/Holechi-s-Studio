import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Calendar, User, MessageSquare, Plus, CheckCircle, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { WriteModal } from './WriteModal';

export const GuestbookView: React.FC = () => {
  const {
    guestbooks,
    notices,
    addGuestbook,
    isAdmin,
  } = useBlog();

  // Writer states
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [writerError, setWriterError] = useState('');

  // Accordion active index for notices
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  // Sorting notices: important ones first
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return 0;
  });

  const handleNoticeToggle = (id: string) => {
    setExpandedNoticeId(expandedNoticeId === id ? null : id);
  };

  const handlePublishGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    setWriterError('');

    if (!nickname.trim() || !content.trim()) {
      setWriterError('닉네임과 인사말 내용을 입력해 주세요.');
      return;
    }

    addGuestbook(nickname, content);
    setNickname('');
    setContent('');
    alert('방명록에 발도장이 성공적으로 찍혔습니다 🐾');
  };

  return (
    <div id="guestbook-and-notices-view" className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      
      {/* Title */}
      <div id="guestbook-header" className="text-center space-y-3">
        <h2 className="font-display font-bold text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
          알림판 & 방명록
        </h2>
        <p className="text-sm text-[#746D68] dark:text-[#9E958E] max-w-lg mx-auto leading-relaxed font-light">
          공방의 새 공지사항을 확인하고, 오고 가며 따뜻한 안부 인사 한 마디를 고운 흔적으로 편안하게 남겨두는 방입니다.
        </p>
      </div>

      {/* SECTION 1: Notices (알림판) */}
      <section id="notices-cabinet" className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E6DED5] dark:border-[#3D3330]">
          <Bell size={18} className="text-[#C69A52]" />
          <h3 className="font-display font-bold text-lg text-[#4B352D] dark:text-white">
            공방 알림판
          </h3>
        </div>

        {sortedNotices.length === 0 ? (
          <p className="text-xs text-[#746D68] italic">공지사항이 비어있습니다.</p>
        ) : (
          <div className="space-y-3">
            {sortedNotices.map((notice) => {
              const isExpanded = expandedNoticeId === notice.id;
              return (
                <div
                  key={notice.id}
                  id={`notice-item-${notice.id}`}
                  className={`border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? 'bg-white dark:bg-[#25201E] shadow-sm'
                      : 'bg-white/50 dark:bg-[#25201E]/40 hover:bg-white'
                  }`}
                >
                  {/* Notice Accordion Header */}
                  <div
                    onClick={() => handleNoticeToggle(notice.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {notice.isImportant ? (
                        <span className="shrink-0 text-[9px] font-bold bg-[#C69A52] text-white px-2 py-0.5 rounded-md shadow-xs">
                          📌 필독
                        </span>
                      ) : (
                        <span className="shrink-0 text-[9px] font-bold bg-[#EEE7DE] dark:bg-[#332B28] text-[#4B352D] dark:text-[#DFB775] px-2 py-0.5 rounded-md">
                          공지
                        </span>
                      )}
                      <span className="font-bold text-xs sm:text-sm text-[#4B352D] dark:text-white truncate">
                        {notice.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-[#746D68] dark:text-[#9E958E]">
                        {notice.createdAt}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Notice Accordion Content */}
                  {isExpanded && (
                    <div className="p-5 bg-gray-50/50 dark:bg-[#1A1614]/20 border-t border-[#E6DED5] dark:border-[#3D3330] text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light whitespace-pre-line animate-fade-in">
                      {notice.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: Guestbook Writing Form */}
      <section id="guestbook-form-cabinet" className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#4B352D] dark:text-white pb-3 border-b border-[#E6DED5]/80 dark:border-[#3D3330]/80">
          방명록 남기기 🐾
        </h3>

        {writerError && (
          <p className="text-xs text-[#B74A45] font-semibold">⚠️ {writerError}</p>
        )}

        <form onSubmit={handlePublishGuestbook} id="guestbook-writer" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-[#746D68] dark:text-[#9E958E] uppercase tracking-wider mb-1.5">
                닉네임 *
              </label>
              <input
                type="text"
                required
                placeholder="인사하는 손님명"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-[#FAF8F4] dark:bg-[#1A1614] text-xs focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold text-[#746D68] dark:text-[#9E958E] uppercase tracking-wider mb-1.5">
                소중한 안부 인사말씀 *
              </label>
              <textarea
                required
                rows={2}
                placeholder="오고 가며 전하는 한 줄의 온기, 다정한 이야기를 적어보세요 😊"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-[#FAF8F4] dark:bg-[#1A1614] text-xs focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 h-11 bg-[#4B352D] hover:bg-[#3d2b24] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              방명록 발도장 찍기🐾
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 3: Guestbook Feed */}
      <section id="guestbook-feed-cabinet" className="space-y-6">
        <h3 className="font-display font-bold text-lg text-[#4B352D] dark:text-white pb-3 border-b border-[#E6DED5] dark:border-[#3D3330]">
          친구들이 머물다 간 자리 ({guestbooks.length}개)
        </h3>

        {guestbooks.length === 0 ? (
          <p className="text-center py-10 text-xs text-[#746D68]">공방을 찾아온 친구의 첫 발자취를 남겨보세요.</p>
        ) : (
          <div className="space-y-6">
            {guestbooks.map((guest) => (
              <div
                key={guest.id}
                className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs"
              >
                {/* Author profile */}
                <div className="flex justify-between items-center pb-2.5 border-b border-dashed border-[#E6DED5]/80 dark:border-[#3D3330]/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#EEE7DE] dark:bg-[#332B28] text-[#4B352D] dark:text-[#DFB775] flex items-center justify-center font-bold text-xs">
                      {guest.nickname[0]}
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-[#4B352D] dark:text-[#EBE6E1]">{guest.nickname}</span>
                      <span className="text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono ml-2">{guest.createdAt}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-300 font-mono select-none">🐾 FOOTPRINT</span>
                </div>

                <p className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light whitespace-pre-line pl-1">
                  {guest.content}
                </p>

                {/* Nested Admin Reply */}
                {guest.adminReply && (
                  <div className="ml-4 sm:ml-8 p-4 rounded-2xl bg-[#EEE7DE]/40 dark:bg-[#332B28]/40 border border-[#E6DED5]/80 dark:border-[#3D3330]/85 flex gap-3 animate-fade-in">
                    <span className="text-lg">☕</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#4B352D] dark:text-[#DFB775]">공방 주인장 홀치</span>
                        <span className="px-1.5 py-0.2 bg-[#3F7D5A]/10 text-[#3F7D5A] dark:text-emerald-400 text-[8px] font-bold rounded">답글완료</span>
                      </div>
                      <p className="text-xs text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light whitespace-pre-line">
                        {guest.adminReply}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
