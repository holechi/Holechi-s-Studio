import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, Download, FileText, File, Image as ImageIcon, FolderArchive, Video, FileCode, Plus } from 'lucide-react';
import { WriteModal } from './WriteModal';

export const LibraryView: React.FC = () => {
  const { libraryItems, searchQuery, setSearchQuery, downloadLibraryItem, isAdmin } = useBlog();
  const [selectedType, setSelectedType] = useState<'all' | 'pdf' | 'doc' | 'image' | 'zip' | 'video'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // File type filter helper
  const filteredItems = libraryItems.filter((item) => {
    const matchesType = selectedType === 'all' || item.fileType === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />;
      case 'doc':
        return <File className="text-blue-500" size={20} />;
      case 'image':
        return <ImageIcon className="text-emerald-500" size={20} />;
      case 'zip':
        return <FolderArchive className="text-amber-600" size={20} />;
      case 'video':
        return <Video className="text-purple-500" size={20} />;
      default:
        return <FileCode className="text-gray-500" size={20} />;
    }
  };

  const typesList = [
    { id: 'all', label: '전체 자료' },
    { id: 'pdf', label: 'PDF 지침서' },
    { id: 'doc', label: '일반 문서' },
    { id: 'image', label: '도안/이미지' },
    { id: 'zip', label: '압축팩(ZIP)' },
    { id: 'video', label: '설명 비디오' },
  ] as const;

  return (
    <div id="library-view" className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Title */}
      <div id="library-header" className="text-center space-y-3 mb-10">
        <h2 className="font-display font-bold text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
          공방 자료실
        </h2>
        <p className="text-sm text-[#746D68] dark:text-[#9E958E] max-w-lg mx-auto leading-relaxed font-light">
          원목 수저/도마 가공 디자인 도안, 천연 마감 오일 활용 가이드북, 에스프레소 브루잉 기록 시트 등 생활에 피가 되고 살이 되는 유익한 지식을 나눕니다.
        </p>
      </div>

      {/* Controllers */}
      <div id="library-controls" className="space-y-4 border-b border-[#E6DED5] dark:border-[#3D3330] pb-6 mb-8">
        
        {/* Horizontal filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {typesList.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'bg-[#4B352D] text-white dark:bg-[#DFB775] dark:text-[#25201E]'
                  : 'bg-white dark:bg-[#25201E] text-[#746D68] dark:text-[#9E958E] border border-[#E6DED5] dark:border-[#3D3330] hover:bg-gray-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-semibold text-[#746D68] dark:text-[#9E958E]">
            검색 결과 <b className="text-[#C69A52] font-mono">{filteredItems.length}</b>개 리소스 매칭됨
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="자료 파일 이름 검색..."
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
                <span>자료 추가</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Library collection list */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#25201E] rounded-3xl border border-[#E6DED5] dark:border-[#3D3330]">
          <p className="text-sm text-[#746D68] dark:text-[#9E958E]">등록된 자료 가이드북이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#E6DED5] dark:divide-[#3D3330]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-800/20"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 border border-[#E6DED5] dark:border-[#3D3330] rounded-xl shrink-0">
                  {getFileIcon(item.fileType)}
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#4B352D] dark:text-white hover:text-[#C69A52]">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-[#746D68] dark:text-[#9E958E] mt-1.5 font-medium">
                    <span className="uppercase text-[#C69A52]">{item.fileType} 포맷</span>
                    <span>•</span>
                    <span>파일 크기: {item.fileSize}</span>
                    <span>•</span>
                    <span>게시 날짜: {item.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Download trigger */}
              <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-[#E6DED5]/40 pt-4 sm:pt-0">
                <div className="text-left sm:text-right font-mono text-[11px] text-[#746D68] dark:text-[#9E958E]">
                  <span>누적 다운로드: </span>
                  <b className="text-gray-900 dark:text-white">{item.downloads}</b>회
                </div>
                
                <button
                  onClick={() => {
                    downloadLibraryItem(item.id);
                    alert(`[${item.title}] 가상 내려받기를 시작합니다. (파일크기: ${item.fileSize}) \n성공적으로 브라우저에 임시 다운로드 되었습니다.`);
                  }}
                  className="h-10 px-5 rounded-xl bg-[#4B352D] hover:bg-[#3d2b24] text-white dark:bg-[#DFB775] dark:hover:bg-[#d2a760] dark:text-[#25201E] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download size={14} />
                  <span>다운로드</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Popup */}
      {showAddModal && (
        <WriteModal type="library" onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};
