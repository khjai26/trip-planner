import React from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { HERO_MOODBOARD_IMAGES } from "../data/travelOptions";

interface HeroSectionProps {
  onScrollToForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToForm }) => {
  return (
    <section id="hero" className="relative pt-8 pb-14 md:pt-12 md:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading Area */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <p className="text-xs md:text-sm font-medium tracking-widest text-[#9CAF88] uppercase mb-3">
            curated journeys & aesthetic wanderlust
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2E2E2E] leading-[1.18] mb-4 text-balance">
            국내부터 해외까지, <br className="hidden sm:inline" />
            <span className="text-[#C47A5A]">AI가 설계하는</span> 나만의 여행
          </h1>

          <p className="text-sm md:text-base text-[#2E2E2E]/70 max-w-xl mx-auto leading-relaxed">
            복잡한 검색과 일정 조율은 그만. 취향, 예산, 동행인만 탭하면
            현실적인 동선과 숨은 감성 스팟을 1분 만에 큐레이션합니다.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onScrollToForm}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2E2E2E] text-white text-sm font-semibold hover:bg-[#C47A5A] transition-all shadow-md active:scale-95"
            >
              <span>1분 만에 여행 일정 만들기</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Pinterest Style Masonry Collage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {HERO_MOODBOARD_IMAGES.map((item, index) => {
            const isOffset = index % 2 === 1;
            return (
              <div
                key={index}
                className={`relative group overflow-hidden rounded-2xl bg-white border border-[#2E2E2E]/5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                  isOffset ? "md:translate-y-4" : ""
                }`}
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[#ECE6DF]">
                  <img
                    src={item.url}
                    alt={item.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Caption & Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[10px] tracking-wider uppercase text-white/80 font-medium">
                      {item.tag}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold truncate">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro feature pills - unboxed subtle text */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs text-[#2E2E2E]/60">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9CAF88]" />
            국내 17개 시도 & 해외 6개 대륙 지원
          </span>
          <span aria-hidden="true">·</span>
          <span>예산 초과 방지 스마트 계산</span>
          <span aria-hidden="true">·</span>
          <span>반려동물 펫프렌들리 장소 엄선</span>
          <span aria-hidden="true">·</span>
          <span>핀터레스트 무드보드 저장 기능</span>
        </div>
      </div>
    </section>
  );
};
