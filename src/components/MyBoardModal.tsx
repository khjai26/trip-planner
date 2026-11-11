import React, { useState } from "react";
import { X, Bookmark, Trash2, Copy, Check, Clock, Sparkles } from "lucide-react";
import { SavedPlace } from "../types/travel";

interface MyBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: SavedPlace[];
  onRemovePlace: (id: string) => void;
  onClearBoard: () => void;
}

export const MyBoardModal: React.FC<MyBoardModalProps> = ({
  isOpen,
  onClose,
  savedPlaces,
  onRemovePlace,
  onClearBoard,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySaved = () => {
    if (savedPlaces.length === 0) return;
    const text = savedPlaces
      .map(
        (p, i) =>
          `${i + 1}. [Day ${p.dayNumber}] ${p.name} (${p.category}) - ${p.estimatedCost}\n   ${p.description}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(`📌 [WanderAI 내 여행 보드]\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#2E2E2E]/10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#2E2E2E]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#C47A5A]/15 text-[#C47A5A] flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-current" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#2E2E2E]">내 여행 보드</h3>
              <p className="text-xs text-[#2E2E2E]/50">
                총 {savedPlaces.length}개의 핀된 추천 장소
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedPlaces.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleCopySaved}
                  className="px-3 py-1.5 rounded-xl border border-[#2E2E2E]/10 text-xs font-semibold text-[#2E2E2E] hover:border-[#9CAF88] hover:text-[#9CAF88] transition-all flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#9CAF88]" />
                      <span>복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>보드 복사</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClearBoard}
                  className="p-1.5 rounded-xl text-[#2E2E2E]/40 hover:text-red-500 transition-colors"
                  title="보드 비우기"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#2E2E2E]/60 hover:text-[#2E2E2E] hover:bg-[#FAF8F5] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedPlaces.length === 0 ? (
            <div className="py-16 text-center text-[#2E2E2E]/50">
              <Sparkles className="w-8 h-8 text-[#9CAF88]/50 mx-auto mb-3" />
              <p className="text-sm font-semibold">아직 저장된 장소가 없어요.</p>
              <p className="text-xs mt-1">
                일정 결과 카드 우측 상단의 '저장' 버튼을 눌러 나만의 보드를 채워보세요.
              </p>
            </div>
          ) : (
            savedPlaces.map((place) => (
              <div
                key={place.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5 flex items-start justify-between gap-3 group hover:border-[#9CAF88]/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#C47A5A] border border-[#2E2E2E]/5">
                      Day {place.dayNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-[#2E2E2E]/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {place.time}
                    </span>
                    <span className="text-[11px] font-semibold text-[#2E2E2E]/50">
                      · {place.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#2E2E2E]">{place.name}</h4>
                  <p className="text-xs text-[#2E2E2E]/70 line-clamp-2">
                    {place.description}
                  </p>

                  <p className="text-[11px] font-semibold text-[#2E2E2E]">
                    예상 비용: {place.estimatedCost}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemovePlace(place.id)}
                  className="p-2 rounded-xl text-[#2E2E2E]/30 hover:text-red-500 hover:bg-white transition-all shrink-0"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#2E2E2E]/5 text-center">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#2E2E2E] text-white text-xs font-semibold hover:bg-[#C47A5A] transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
