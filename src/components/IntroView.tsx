import React from 'react';
import { Mail, MapPin, Compass, Clock, ShieldCheck, Heart } from 'lucide-react';

export const IntroView: React.FC = () => {
  return (
    <div id="studio-intro-view" className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      
      {/* Title */}
      <div id="intro-header" className="text-center space-y-3">
        <h2 className="font-display font-bold text-3xl text-[#4B352D] dark:text-[#DFB775] tracking-tight">
          공방을 소개합니다
        </h2>
        <p className="text-sm text-[#746D68] dark:text-[#9E958E] max-w-lg mx-auto leading-relaxed font-light">
          나무와 종이, 커피 향이 스며든 아늑한 공간. ‘홀치의 공방’에 머무르는 깊은 생각과 소소한 가치를 들려드립니다.
        </p>
      </div>

      {/* Main Cover Landscape Image */}
      <div className="w-full h-80 rounded-3xl overflow-hidden relative border border-[#E6DED5] dark:border-[#3D3330]">
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
          alt="Studio Workspace Layout"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6 sm:p-8">
          <div className="text-white">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFB775]">Studio Philosophy</span>
            <h3 className="font-display font-bold text-xl sm:text-2xl mt-1 text-white">
              “손 끝으로 만지는 아날로그, 마음으로 나누는 우정”
            </h3>
          </div>
        </div>
      </div>

      {/* Narrative grid: values & owners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h3 className="font-display font-bold text-lg text-[#4B352D] dark:text-[#DFB775] flex items-center gap-1.5">
            <Compass size={18} />
            <span>홀치의 공방이란?</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E] leading-relaxed font-light whitespace-pre-line">
            <b>‘홀치의 공방’ (HOLCHI’S STUDIO)</b>은 바쁜 현대 사회의 빠른 속도를 잠시 내려놓고, 느리지만 단단하게 일상의 가치를 매만지는 소담하고 따뜻한 블로그 공간입니다.

            이곳에서 공방지기 홀치는 원목을 가공하여 소박한 수제 도마와 수저를 깎고, 정성 들여 커피 원두를 내려 마십니다. 오랫동안 마주하지 못한 오랜 친구들에게 손수 쓴 잉크의 안부를 전하듯, 편안하고 다정한 이야기들과 좋은 자료들을 아낌없이 모아두고 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-display font-bold text-lg text-[#4B352D] dark:text-[#DFB775] flex items-center gap-1.5">
            <Heart size={18} />
            <span>우리들의 세 가지 마음</span>
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E]">
            <li className="flex gap-2.5 items-start">
              <span className="text-[#C69A52] font-bold shrink-0">1.</span>
              <span><b>정성스러운 기록</b>: 흘러가는 시간 속에 잊히기 쉬운 주말 목공의 결, 우연히 올려다본 퇴근길 노을 등 작은 순간을 소중히 적어둡니다.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-[#C69A52] font-bold shrink-0">2.</span>
              <span><b>아낌없는 나눔</b>: 직접 쓰고 검증해 본 목공 교실 가이드북과 드립 레시피 시트 등 생활에 훌륭한 정보 리소스를 조건 없이 공유합니다.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="text-[#C69A52] font-bold shrink-0">3.</span>
              <span><b>다정한 교류</b>: 먼 곳에 있는 동네 친구나 방문자 모두가 편안하게 발도장(방명록🐾)을 남기며 두런두런 근황을 주고받는 사랑방이 됩니다.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* SECTION 3: Location Guide (오시는 길) */}
      <section id="location-guide" className="bg-white dark:bg-[#25201E] border border-[#E6DED5] dark:border-[#3D3330] rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#4B352D] dark:text-white pb-3 border-b border-[#E6DED5]/80 dark:border-[#3D3330]/80">
          📍 찾아오시는 길 & 공방 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Map info description */}
          <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-[#746D68] dark:text-[#9E958E]">
            <div className="flex gap-2.5 items-start">
              <MapPin size={16} className="text-[#C69A52] mt-0.5 shrink-0" />
              <div>
                <b className="text-gray-900 dark:text-white block">공방 주소지</b>
                <span>서울특별시 마포구 성산로 12길 34 (연남동 부근 골목 안쪽 하얀 대문집)</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <Clock size={16} className="text-[#C69A52] mt-0.5 shrink-0" />
              <div>
                <b className="text-gray-900 dark:text-white block">사랑방 운영일시</b>
                <span>매주 토/일요일 11:00 ~ 19:00 (원데이 공예 체험 사전 예약제 운영)</span>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <ShieldCheck size={16} className="text-[#C69A52] mt-0.5 shrink-0" />
              <div>
                <b className="text-gray-900 dark:text-white block">교통편 안내</b>
                <span>지하철 2호선 홍대입구역 3번 출구 도보 12분 / 경의중앙선 가좌역 도보 8분 거리</span>
              </div>
            </div>
            
            <div className="p-4 bg-[#FAF8F4] dark:bg-[#1A1614] rounded-2xl border border-[#E6DED5] dark:border-[#3D3330]/80 text-xs">
              <b className="text-[#4B352D] dark:text-[#DFB775] block mb-1">💡 클래스 참여를 원하시는 친구분들께</b>
              <span>공방 공간 협소로 인해 모든 목공/브루잉 클래스는 예약제로만 진행됩니다. 참여를 희망하시는 분은 주인장 이메일(<code className="bg-[#EEE7DE] dark:bg-[#332B28] px-1 py-0.5 rounded text-[#4B352D] dark:text-[#DFB775]">kchyun77@gmail.com</code>)이나 방명록에 비밀 연락처를 포함하여 신청해 주시면 감사하겠습니다.</span>
            </div>
          </div>

          {/* Graphical Mockup Map representation */}
          <div className="md:col-span-5 bg-[#FAF8F4] dark:bg-[#1A1614] rounded-2xl border border-[#E6DED5] dark:border-[#3D3330] p-4 flex flex-col justify-center items-center relative min-h-[180px] overflow-hidden select-none">
            {/* Visual Vector Grid layout inside card */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4b352d_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Minimalist stylized illustrative nodes */}
            <div className="relative space-y-4 text-center">
              <div className="w-8 h-8 rounded-full bg-[#4B352D] text-[#C69A52] mx-auto flex items-center justify-center font-bold text-xs shadow-md border border-[#C69A52]">
                H
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#4B352D] dark:text-[#DFB775] tracking-tight block">
                  홀치의 연남동 공방
                </span>
                <span className="text-[9px] text-[#746D68] font-mono block">
                  LAT: 37.5583° N / LON: 126.9240° E
                </span>
              </div>
              <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold rounded-md border border-emerald-200">
                ● 실시간 예약 가능
              </span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
