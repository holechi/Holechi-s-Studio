import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';

interface WriteModalProps {
  type: 'story' | 'photo' | 'travel' | 'friend' | 'library' | 'notice' | 'guestbook';
  onClose: () => void;
}

const PHOTO_PRESETS = [
  {
    name: '☕ 아침 커피',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🪵 원목 공방',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '📚 아늑한 서재',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🌅 제주 해변',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🕯️ 은은한 촛불',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🌲 소나무 숲',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: '🐾 들꽃 정원',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  },
];

export const WriteModal: React.FC<WriteModalProps> = ({ type, onClose }) => {
  const {
    addStory,
    addPhoto,
    addTravel,
    addFriendPost,
    addLibraryItem,
    addNotice,
    addGuestbook,
  } = useBlog();

  // General fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // Specific fields
  const [category, setCategory] = useState<'일상' | '생각' | '취미' | '소식'>('일상');
  const [takenAt, setTakenAt] = useState(new Date().toISOString().split('T')[0]);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'doc' | 'image' | 'zip' | 'video' | 'etc'>('pdf');
  const [fileSize, setFileSize] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [description, setDescription] = useState('');

  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    try {
      if (type === 'guestbook') {
        if (!nickname.trim() || !content.trim()) {
          setValidationError('닉네임과 방명록 내용을 모두 입력하세요.');
          return;
        }
        addGuestbook(nickname, content);
      } else if (type === 'friend') {
        if (!nickname.trim() || !title.trim() || !content.trim()) {
          setValidationError('닉네임, 제목, 내용을 모두 입력하세요.');
          return;
        }
        addFriendPost({ nickname, title, content, imageUrl: imageUrl || undefined });
      } else if (type === 'story') {
        if (!title.trim() || !content.trim()) {
          setValidationError('제목과 내용을 모두 입력하세요.');
          return;
        }
        addStory({
          category,
          title,
          content,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        });
      } else if (type === 'photo') {
        if (!title.trim() || !description.trim() || !imageUrl.trim()) {
          setValidationError('제목, 설명, 사진 주소를 모두 선택 또는 입력해 주세요.');
          return;
        }
        addPhoto({
          title,
          description,
          imageUrl,
          takenAt,
        });
      } else if (type === 'travel') {
        if (!destination.trim() || !title.trim() || !content.trim()) {
          setValidationError('여행지, 제목, 내용을 모두 입력하세요.');
          return;
        }
        addTravel({
          destination,
          title,
          content,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          date: date || new Date().toISOString().split('T')[0],
          tags: tags ? tags.split(',').map((t) => t.trim()) : [],
        });
      } else if (type === 'library') {
        if (!title.trim() || !fileSize.trim()) {
          setValidationError('자료 제목과 파일 크기를 입력하세요.');
          return;
        }
        addLibraryItem({
          title,
          fileType,
          fileSize,
        });
      } else if (type === 'notice') {
        if (!title.trim() || !content.trim()) {
          setValidationError('공지 제목과 내용을 입력하세요.');
          return;
        }
        addNotice({
          title,
          content,
          isImportant,
        });
      }

      onClose();
      alert('성공적으로 등록되었습니다.');
    } catch (err: any) {
      setValidationError('등록 중 오류가 발생했습니다.');
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'story':
        return '새 이야기 등록 (관리자)';
      case 'photo':
        return '새 사진앨범 등록 (관리자)';
      case 'travel':
        return '새 여행기 기록 (관리자)';
      case 'friend':
        return '친구 소식 남기기';
      case 'library':
        return '자료실 리소스 등록 (관리자)';
      case 'notice':
        return '새 공지사항 등록 (관리자)';
      case 'guestbook':
        return '방명록 남기기';
      default:
        return '글쓰기';
    }
  };

  return (
    <div
      id="write-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="write-modal-content"
        className="w-full max-w-lg bg-[#FAF8F4] dark:bg-[#25201E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6DED5] dark:border-[#3D3330] my-8 max-h-[90vh] overflow-y-auto animate-fade-in relative text-[#25211F] dark:text-[#EBE6E1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DED5] dark:border-[#3D3330] mb-6">
          <h3 className="font-display font-bold text-lg sm:text-xl text-[#4B352D] dark:text-[#DFB775]">
            {getModalTitle()}
          </h3>
          <button
            id="write-modal-close"
            onClick={onClose}
            className="p-1 rounded-lg text-[#746D68] dark:text-[#9E958E] hover:bg-[#EEE7DE] dark:hover:bg-[#332B28] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Validation Error Alert */}
        {validationError && (
          <div
            id="write-validation-error"
            className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-xs text-[#B74A45] font-semibold flex items-center gap-2"
          >
            ⚠️ {validationError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} id="write-form" className="space-y-4">
          {/* USER INFO FIELDS for guest actions */}
          {(type === 'friend' || type === 'guestbook') && (
            <div>
              <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                방문자 닉네임 *
              </label>
              <input
                id="form-nickname"
                type="text"
                required
                placeholder="예: 예쁜하늘"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
              />
            </div>
          )}

          {/* CATEGORY for Story */}
          {type === 'story' && (
            <div>
              <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                분류 카테고리
              </label>
              <select
                id="form-category"
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
              >
                <option value="일상">일상 ☕</option>
                <option value="취미">취미 🪵</option>
                <option value="생각">생각 💭</option>
                <option value="소식">소식 📣</option>
              </select>
            </div>
          )}

          {/* DESTINATION & DATE for Travel */}
          {type === 'travel' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                  지역 / 여행지 *
                </label>
                <input
                  id="form-destination"
                  type="text"
                  required
                  placeholder="예: 제주도, 경주"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                  여행 일자
                </label>
                <input
                  id="form-travel-date"
                  type="text"
                  placeholder="예: 2026-06-12 ~ 2026-06-15"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
                />
              </div>
            </div>
          )}

          {/* TITLE for most elements except guestbook */}
          {type !== 'guestbook' && (
            <div>
              <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                글 제목 *
              </label>
              <input
                id="form-title"
                type="text"
                required
                placeholder={type === 'library' ? '예: 원목 수저 가이드북' : '정성스런 제목을 적어주세요'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
              />
            </div>
          )}

          {/* PHOTO TAKEN DATE for Photo */}
          {type === 'photo' && (
            <div>
              <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                촬영일자
              </label>
              <input
                id="form-taken-at"
                type="date"
                required
                value={takenAt}
                onChange={(e) => setTakenAt(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
              />
            </div>
          )}

          {/* FILE DETAILS for Library */}
          {type === 'library' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                  파일 종류
                </label>
                <select
                  id="form-file-type"
                  value={fileType}
                  onChange={(e: any) => setFileType(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
                >
                  <option value="pdf">PDF 문서</option>
                  <option value="doc">일반 문서 (Word/Hwp)</option>
                  <option value="image">이미지 파일</option>
                  <option value="zip">압축 파일 (ZIP)</option>
                  <option value="video">비디오 동영상</option>
                  <option value="etc">기타 가이드</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                  파일 용량 크기 *
                </label>
                <input
                  id="form-file-size"
                  type="text"
                  required
                  placeholder="예: 4.8 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
                />
              </div>
            </div>
          )}

          {/* IMAGE URL PRESETS (For Story, Travel, Photo, Friend) */}
          {(type === 'story' || type === 'photo' || type === 'travel' || type === 'friend') && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                감성 사진 선택 (프리셋 선택 또는 URL 입력)
              </label>
              
              {/* Presets flex container */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#EEE7DE]/40 dark:bg-[#332B28]/40 rounded-xl border border-[#E6DED5] dark:border-[#3D3330]">
                {PHOTO_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      imageUrl === preset.url
                        ? 'bg-[#4B352D] text-white'
                        : 'bg-white dark:bg-[#1A1614] hover:bg-[#EEE7DE]'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <input
                id="form-image-url"
                type="text"
                placeholder="또는 직접 가져온 이미지 URL 주소를 입력하세요"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-xs"
              />
            </div>
          )}

          {/* TRAVEL TAGS for Travel */}
          {type === 'travel' && (
            <div>
              <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
                여행 해시태그 (쉼표로 구분)
              </label>
              <input
                id="form-travel-tags"
                type="text"
                placeholder="예: 힐링, 바다, 맛집, 경주"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm"
              />
            </div>
          )}

          {/* IMPORTANT flag for notice */}
          {type === 'notice' && (
            <div className="flex items-center gap-2 py-1">
              <input
                id="form-notice-important"
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-4 h-4 text-[#C69A52] focus:ring-[#C69A52] border-[#E6DED5] rounded"
              />
              <label
                htmlFor="form-notice-important"
                className="text-xs font-bold text-[#B74A45]"
              >
                📌 이 글을 최상단 중요 공지사항으로 등록합니다.
              </label>
            </div>
          )}

          {/* CONTENT text area */}
          <div>
            <label className="block text-xs font-semibold text-[#746D68] dark:text-[#9E958E] mb-1.5">
              {type === 'photo' ? '사진 상세 설명 *' : '본문 내용 *'}
            </label>
            <textarea
              id="form-content"
              required
              rows={type === 'guestbook' ? 3 : 5}
              placeholder={
                type === 'guestbook'
                  ? '공방지기에게 남기고 싶은 한마디를 적어주세요 😊'
                  : '감성적인 생각과 이야기를 따뜻하게 써내려가 보세요...'
              }
              value={type === 'photo' ? description : content}
              onChange={(e) => (type === 'photo' ? setDescription(e.target.value) : setContent(e.target.value))}
              className="w-full p-3.5 rounded-xl border border-[#E6DED5] dark:border-[#3D3330] bg-white dark:bg-[#1A1614] focus:outline-none focus:ring-2 focus:ring-[#C69A52]/20 text-sm leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            id="form-submit-btn"
            type="submit"
            className="w-full h-12 rounded-xl bg-[#4B352D] hover:bg-[#3d2b24] dark:bg-[#DFB775] dark:hover:bg-[#d2a760] text-white dark:text-[#25201E] font-semibold text-sm tracking-wide transition-colors shadow-md mt-4 cursor-pointer"
          >
            기록 완료하기
          </button>
        </form>
      </div>
    </div>
  );
};
