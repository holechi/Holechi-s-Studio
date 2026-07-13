import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { MessageSquare, Heart, Plus, Search, Send, CornerDownRight } from 'lucide-react';
import { WriteModal } from './WriteModal';

export const FriendView: React.FC = () => {
  const {
    friendPosts,
    searchQuery,
    setSearchQuery,
    likeFriendPost,
    addFriendComment,
  } = useBlog();

  const [showAddModal, setShowAddModal] = useState(false);
  
  // States for active commenting
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [cmtNickname, setCmtNickname] = useState('');
  const [cmtContent, setCmtContent] = useState('');
  const [commentError, setCommentError] = useState('');

  // Filter friend posts
  const filteredPosts = friendPosts.filter((post) =>
    post.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    setCommentError('');

    if (!cmtNickname.trim() || !cmtContent.trim()) {
      setCommentError('닉네임과 댓글 내용을 모두 입력해 주세요.');
      return;
    }

    addFriendComment(postId, cmtNickname, cmtContent);
    setCmtNickname('');
    setCmtContent('');
    setCommentError('');
    alert('댓글이 등록되었습니다 😊');
  };

  return (
    <div id="friend-updates-view" className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Title */}
      <div id="friend-header" className="text-center space-y-3 mb-10">
        <h2 className="font-display font-bold text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
          친구들의 사랑방
        </h2>
        <p className="text-sm text-[#746D68] dark:text-[#9E958E] max-w-lg mx-auto leading-relaxed font-light">
          공방에 방문해주신 고마운 친구들의 소식과 안부를 모아두는 소담하고 아늑한 방입니다. 서로 따뜻한 인사와 소통을 나눠보세요.
        </p>
      </div>

      {/* Control rows */}
      <div id="friend-controls" className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E6DED5] dark:border-[#3D3330] pb-5 mb-8">
        <span className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">
          게시된 친구 이야기 <b className="text-[#C69A52] font-mono">{filteredPosts.length}</b>개
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="작성자, 소식 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 h-9 pl-9 pr-4 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#25201E] text-xs focus:outline-none focus:border-[#C69A52]"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-[#746D68]" />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 h-9 bg-[#4B352D] hover:bg-[#3d2b24] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Plus size={13} />
            <span>내 소식 올리기</span>
          </button>
        </div>
      </div>

      {/* List items */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#25201E] rounded-3xl border border-dashed border-[#E6DED5] dark:border-[#3D3330]">
          <p className="text-sm text-[#746D68] dark:text-[#9E958E]">
            사랑방에 아직 친구 소식이 없습니다. 첫 번째 다정한 근황을 공유해 볼까요?
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-5 h-10 rounded-xl bg-[#C69A52] text-white font-bold text-xs shadow-md cursor-pointer"
          >
            안부 인사 글쓰기 ✏️
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
            >
              {/* Profile Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E6DED5]/80 dark:border-[#3D3330]/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4B352D] dark:bg-[#DFB775] text-white dark:text-[#25201E] font-display font-bold text-base flex items-center justify-center">
                    {post.nickname[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-[#4B352D] dark:text-[#EBE6E1]">
                      {post.nickname}
                    </h4>
                    <span className="text-[10px] text-[#746D68] dark:text-[#9E958E] font-mono">📅 {post.createdAt}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#C69A52]/10 text-[#C69A52] dark:text-[#DFB775] px-2.5 py-0.5 rounded">
                  손님글
                </span>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#25211F] dark:text-white">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light whitespace-pre-line">
                  {post.content}
                </p>

                {post.imageUrl && (
                  <div className="max-w-xl rounded-2xl overflow-hidden border border-[#E6DED5]/60">
                    <img src={post.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full max-h-80 object-cover" />
                  </div>
                )}
              </div>

              {/* Recommendations and Comment drawer triggers */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#E6DED5]/50 dark:border-[#3D3330]/50 text-xs">
                <button
                  onClick={() => likeFriendPost(post.id)}
                  className="flex items-center gap-1.5 font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  ❤️ 추천 {post.likes}
                </button>
                
                <button
                  onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 font-bold text-[#C69A52] bg-[#EEE7DE]/40 dark:bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-[#EEE7DE]/60 cursor-pointer"
                >
                  <MessageSquare size={13} />
                  <span>댓글 {post.comments.length}개</span>
                </button>
              </div>

              {/* COMMENTS TRAY */}
              <div className="bg-[#FAF8F4] dark:bg-[#1A1614] rounded-2xl p-4 space-y-4 border border-[#E6DED5] dark:border-[#3D3330]">
                {post.comments.length === 0 ? (
                  <p className="text-[11px] text-[#746D68] italic pl-2">아직 작성된 댓말이 없습니다. 첫 마디를 전해보세요!</p>
                ) : (
                  <div className="space-y-3.5 max-h-60 overflow-y-auto">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5 items-start text-xs">
                        <CornerDownRight size={14} className="text-[#C69A52] mt-1 shrink-0" />
                        <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-xl p-3 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-bold text-[#4B352D] dark:text-[#DFB775]">{comment.nickname}</span>
                            <span className="text-[9px] text-[#746D68] dark:text-[#9E958E] font-mono">{comment.createdAt}</span>
                          </div>
                          <p className="text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Commenting form */}
                {commentingPostId === post.id && (
                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post.id)}
                    className="pt-3 border-t border-dashed border-[#E6DED5] dark:border-[#3D3330] space-y-3 animate-fade-in"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="닉네임"
                        value={cmtNickname}
                        onChange={(e) => setCmtNickname(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#25201E] text-xs focus:outline-none col-span-1"
                      />
                      <input
                        type="text"
                        required
                        placeholder="소중한 안부 댓글을 남겨주세요..."
                        value={cmtContent}
                        onChange={(e) => setCmtContent(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#25201E] text-xs focus:outline-none sm:col-span-3 flex-1"
                      />
                    </div>
                    {commentError && <p className="text-[10px] text-red-500">{commentError}</p>}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="h-9 px-4 rounded-xl bg-[#4B352D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send size={11} />
                        <span>전송하기</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publishing Modal popup */}
      {showAddModal && (
        <WriteModal type="friend" onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};
