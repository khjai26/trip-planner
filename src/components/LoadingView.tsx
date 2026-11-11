import React, { useEffect, useState } from "react";
import { Plane, Compass, Sparkles, X } from "lucide-react";

interface LoadingViewProps {
  onCancel?: () => void;
}

export const LoadingView: React.FC<LoadingViewProps> = ({ onCancel }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  const steps = [
    "최적의 여행 코스를 찾는 중...",
    "선호하는 분위기와 숨은 명소 매칭 중...",
    "동선 낭비 없는 시간표와 예상 경비 계산 중...",
    "설레는 감성 핀터레스트 보드 큐레이션 중...",
  ];

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2000);

    const secTimer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepTimer);
      clearInterval(secTimer);
    };
  }, [steps.length]);

  return (
    <div className="py-20 px-4 text-center max-w-lg mx-auto animate-fadeIn">
      {/* Flight animation track */}
      <div className="relative w-48 h-24 mx-auto mb-6 flex items-center justify-center">
        {/* Arc dashed track */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-20 border-b-2 border-dashed border-[#9CAF88]/40 rounded-full" />
        </div>

        {/* Floating animated airplane */}
        <div className="relative z-10 animate-bounce">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10 shadow-md flex items-center justify-center text-[#C47A5A]">
            <Plane className="w-7 h-7 transform rotate-45" />
          </div>
        </div>

        {/* Subtle sparkle accents */}
        <div className="absolute top-2 right-4 text-[#9CAF88] animate-pulse">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-1 left-4 text-[#D8A7A0] animate-pulse delay-75">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Main loading copy */}
      <h3 className="text-xl font-bold text-[#2E2E2E] mb-2 tracking-tight">
        {steps[stepIndex]}
      </h3>

      <p className="text-xs sm:text-sm text-[#2E2E2E]/60 max-w-xs mx-auto leading-relaxed">
        입력하신 예산과 키워드를 분석하여 현실적이고 낭만적인 일정을 직조하고 있습니다.
      </p>

      {/* Progress pill indicator */}
      <div className="mt-6 flex justify-center items-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === stepIndex ? "w-8 bg-[#9CAF88]" : "w-2 bg-[#2E2E2E]/10"
            }`}
          />
        ))}
      </div>

      {/* Cancel button if taking more than 5 seconds */}
      {elapsedSec >= 5 && onCancel && (
        <div className="mt-8 animate-fadeIn">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#2E2E2E]/10 text-xs font-semibold text-[#2E2E2E]/60 hover:text-[#2E2E2E] hover:border-[#2E2E2E]/30 transition-all shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>생성 취소하고 입력창으로 돌아가기</span>
          </button>
        </div>
      )}
    </div>
  );
};
