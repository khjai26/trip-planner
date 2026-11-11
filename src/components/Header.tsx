import React from "react";
import { Bookmark, Compass } from "lucide-react";

interface HeaderProps {
  savedCount: number;
  onOpenSavedModal: () => void;
  onScrollToForm: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSavedModal,
  onScrollToForm,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#2E2E2E]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            className="flex items-center gap-2 group text-xl font-bold tracking-tight text-[#2E2E2E] whitespace-nowrap"
          >
            <span className="w-8 h-8 rounded-xl bg-[#9CAF88]/20 flex items-center justify-center text-[#9CAF88] group-hover:bg-[#9CAF88] group-hover:text-white transition-colors">
              <Compass className="w-5 h-5" />
            </span>
            <span>WanderAI</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2E2E2E]/70">
          <a
            href="#hero"
            className="hover:text-[#2E2E2E] transition-colors whitespace-nowrap shrink-0"
          >
            여행 영감
          </a>
          <button
            onClick={onScrollToForm}
            className="hover:text-[#2E2E2E] transition-colors whitespace-nowrap shrink-0 text-left"
          >
            일정 만들기
          </button>
          <a
            href="#keywords"
            onClick={(e) => {
              e.preventDefault();
              onScrollToForm();
            }}
            className="hover:text-[#2E2E2E] transition-colors whitespace-nowrap shrink-0"
          >
            테마 무드보드
          </a>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSavedModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#2E2E2E] bg-white border border-[#2E2E2E]/10 rounded-xl hover:border-[#9CAF88] hover:text-[#9CAF88] transition-all shadow-xs active:scale-95"
            aria-label="저장한 장소 보드 보기"
          >
            <Bookmark className="w-4 h-4 text-[#C47A5A]" />
            <span className="whitespace-nowrap">내 여행 보드</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#C47A5A] text-white rounded-full">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
