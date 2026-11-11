import React, { useState } from "react";
import {
  Calendar,
  Wallet,
  Sparkles,
  Plane,
  Clock,
  Compass,
  ArrowRight,
  Dog,
  Bookmark,
  Check,
  Copy,
  RotateCcw,
  ShieldCheck,
  Info,
  Plug,
  SunMedium,
  Coins,
  Globe2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { TravelPlanResponse, PlanPlace } from "../types/travel";

interface ResultSectionProps {
  plan: TravelPlanResponse;
  savedPlaceIds: string[];
  onToggleSavePlace: (place: PlanPlace, dayNumber: number, dayTheme: string) => void;
  onReset: () => void;
  onOpenSavedModal: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  plan,
  savedPlaceIds,
  onToggleSavePlace,
  onReset,
  onOpenSavedModal,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0); // 0 = all or Day 1
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Trigger slight celebratory confetti on mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#9CAF88", "#D8A7A0", "#C47A5A"],
      });
    } catch {
      // Ignore if in test env
    }
  }, []);

  // Format full plan as clean text for clipboard copying
  const handleCopyPlan = () => {
    const lines: string[] = [];
    lines.push(`✈️ [WanderAI 여행 플랜] ${plan.tripTitle}`);
    lines.push(`📍 여행지: ${plan.destination}`);
    lines.push(`📝 요약: ${plan.destinationSummary}`);
    lines.push(
      `💰 예상 총 경비: 약 ${plan.totalCostKRW.toLocaleString("ko-KR")}원 (예산: ${plan.budgetComparison.userBudgetKRW.toLocaleString("ko-KR")}원)`
    );
    lines.push("");

    plan.days.forEach((d) => {
      lines.push(`--- Day ${d.dayNumber} : ${d.themeTitle} ---`);
      d.places.forEach((p) => {
        lines.push(
          `• [${p.time}] ${p.name} (${p.category}) - ${p.estimatedCost}`
        );
        lines.push(`  ${p.description}`);
        if (p.transportToNext) {
          lines.push(`  ↳ 이동: ${p.transportToNext}`);
        }
      });
      lines.push("");
    });

    lines.push("💡 추천 꿀팁:");
    plan.travelTips.forEach((tip, idx) => {
      lines.push(`${idx + 1}. ${tip}`);
    });

    if (plan.checklist) {
      lines.push("");
      lines.push("📋 출국 전 체크리스트:");
      lines.push(`• 비자: ${plan.checklist.visaRequirement}`);
      lines.push(`• 여권: ${plan.checklist.passportValidity}`);
      lines.push(`• 전압/콘센트: ${plan.checklist.voltageAndPlug}`);
      lines.push(`• 날씨/옷차림: ${plan.checklist.weatherAndClothing}`);
    }

    navigator.clipboard.writeText(lines.join("\n"));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const currentDay = plan.days[selectedDayIndex] || plan.days[0];
  const budgetRatio = Math.min(
    100,
    Math.round(
      (plan.totalCostKRW / (plan.budgetComparison.userBudgetKRW || 1)) * 100
    )
  );

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. 상단 요약 카드 (Summary Hero Card) */}
      <div className="bg-white rounded-3xl border border-[#2E2E2E]/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#9CAF88]/15 text-[#9CAF88]">
                {plan.isOverseas ? "🌏 해외 감성 큐레이션" : "🇰🇷 국내 감성 큐레이션"}
              </span>
              <span className="text-xs font-semibold text-[#2E2E2E]/60">
                {plan.destination}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2E2E2E] tracking-tight">
              {plan.tripTitle}
            </h2>

            <p className="text-sm text-[#2E2E2E]/70 leading-relaxed">
              {plan.destinationSummary}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyPlan}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2E2E2E]/10 bg-[#FAF8F5] text-xs font-bold text-[#2E2E2E] hover:border-[#9CAF88] hover:text-[#9CAF88] transition-all active:scale-95 shadow-xs"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#9CAF88]" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>일정 복사하기</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#2E2E2E]/10 bg-[#FAF8F5] text-xs font-bold text-[#2E2E2E]/70 hover:text-[#2E2E2E] transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 만들기</span>
            </button>
          </div>
        </div>

        {/* 예산 비교 프로그레스 바 카드 */}
        <div className="mt-8 p-5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#C47A5A]" />
              <span className="text-xs font-bold text-[#2E2E2E]">
                총 예상 경비 vs 입력 예산 비교
              </span>
            </div>
            <div className="text-xs">
              <span className="text-[#2E2E2E]/60">예상 </span>
              <strong className="text-sm font-extrabold text-[#2E2E2E]">
                {plan.totalCostKRW.toLocaleString("ko-KR")}원
              </strong>
              <span className="text-[#2E2E2E]/40"> / </span>
              <span className="text-[#2E2E2E]/60">
                예산 {plan.budgetComparison.userBudgetKRW.toLocaleString("ko-KR")}원
              </span>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full h-3 rounded-full bg-white border border-[#2E2E2E]/10 overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                budgetRatio > 100 ? "bg-[#C47A5A]" : "bg-[#9CAF88]"
              }`}
              style={{ width: `${Math.min(100, budgetRatio)}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#2E2E2E]/60">
            <span>{plan.budgetComparison.analysisMessage}</span>
            <span className="font-bold text-[#2E2E2E]">
              예산의 {budgetRatio}%
            </span>
          </div>
        </div>

        {/* 여행 팁 3가지 */}
        <div className="mt-6 pt-6 border-t border-[#2E2E2E]/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#9CAF88] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 현지 큐레이터 꿀팁 3</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plan.travelTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5 text-xs text-[#2E2E2E]/80 leading-relaxed"
              >
                <span className="inline-block w-5 h-5 rounded-full bg-[#9CAF88]/20 text-[#9CAF88] font-bold text-center leading-5 text-[10px] mr-2">
                  {idx + 1}
                </span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ★ [해외여행 전용 결과 카드 섹션] */}
      {plan.isOverseas && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 항공 요약 정보 카드 */}
            {plan.flightInfo && (
              <div className="p-5 rounded-3xl bg-white border border-[#2E2E2E]/10 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#9CAF88]">
                    <Plane className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs font-bold text-[#2E2E2E] uppercase tracking-wider">
                    항공 정보 요약
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-[#2E2E2E]/80">
                  <div className="flex justify-between py-1 border-b border-[#2E2E2E]/5">
                    <span className="text-[#2E2E2E]/50">출발 공항 / 유형</span>
                    <span className="font-semibold text-[#2E2E2E]">
                      {plan.flightInfo.departureAirport} · {plan.flightInfo.type}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2E2E2E]/5">
                    <span className="text-[#2E2E2E]/50">예상 비행 시간</span>
                    <span className="font-semibold text-[#2E2E2E]">
                      {plan.flightInfo.estimatedFlightDuration}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2E2E2E]/5">
                    <span className="text-[#2E2E2E]/50">왕복 대략 운임</span>
                    <span className="font-semibold text-[#C47A5A]">
                      {plan.flightInfo.approximateFareKRW}
                    </span>
                  </div>
                  <p className="pt-1 text-[11px] text-[#2E2E2E]/60 leading-normal">
                    💡 {plan.flightInfo.tips}
                  </p>
                </div>
              </div>
            )}

            {/* 현지 환율 & 통화 안내 */}
            {plan.currency && (
              <div className="p-5 rounded-3xl bg-white border border-[#2E2E2E]/10 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#C47A5A]">
                    <Coins className="w-4 h-4" />
                  </span>
                  <h4 className="text-xs font-bold text-[#2E2E2E] uppercase tracking-wider">
                    현지 통화 & 환율 가이드
                  </h4>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF8F5] mb-2 text-xs">
                  <div className="font-bold text-sm text-[#2E2E2E] mb-1">
                    {plan.currency.code} ({plan.currency.symbol})
                  </div>
                  <p className="text-[#2E2E2E]/70 font-medium">
                    {plan.currency.exchangeRateText}
                  </p>
                </div>
                <p className="text-[11px] text-[#2E2E2E]/50 leading-relaxed">
                  * 각 일정 카드의 비용은 현지 통화와 원화 환산액이 함께 표기됩니다.
                  환율은 AI가 추정한 대략적인 값으로 시점에 따라 차이가 있을 수 있습니다.
                </p>
              </div>
            )}
          </div>

          {/* 출국 전 체크리스트 카드 */}
          {plan.checklist && (
            <div className="p-6 rounded-3xl bg-white border border-[#2E2E2E]/10 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#9CAF88]">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <h4 className="text-sm font-bold text-[#2E2E2E]">
                    출국 전 필수 체크리스트
                  </h4>
                </div>
                <span className="text-[11px] text-[#2E2E2E]/50">
                  출발 1~2주 전 점검
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E2E2E] mb-1">
                    <Globe2 className="w-3.5 h-3.5 text-[#9CAF88]" />
                    비자 / 전자여행허가
                  </div>
                  <p className="text-xs text-[#2E2E2E]/70">
                    {plan.checklist.visaRequirement}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E2E2E] mb-1">
                    <Info className="w-3.5 h-3.5 text-[#9CAF88]" />
                    여권 유효기간 & 시차
                  </div>
                  <p className="text-xs text-[#2E2E2E]/70">
                    {plan.checklist.passportValidity} (시차: {plan.checklist.timeDifference})
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E2E2E] mb-1">
                    <Plug className="w-3.5 h-3.5 text-[#9CAF88]" />
                    전압 및 플러그 규격
                  </div>
                  <p className="text-xs text-[#2E2E2E]/70">
                    {plan.checklist.voltageAndPlug}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E2E2E] mb-1">
                    <SunMedium className="w-3.5 h-3.5 text-[#9CAF88]" />
                    현지 날씨 & 옷차림
                  </div>
                  <p className="text-xs text-[#2E2E2E]/70">
                    {plan.checklist.weatherAndClothing}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E2E2E] mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#9CAF88]" />
                    여행자보험 & 팁 문화
                  </div>
                  <p className="text-xs text-[#2E2E2E]/70">
                    {plan.checklist.travelInsurance} · 팁: {plan.checklist.tippingCulture}
                  </p>
                </div>

                {/* 외교부 공식 안내 박스 */}
                <div className="p-3.5 rounded-2xl bg-[#D8A7A0]/15 border border-[#D8A7A0]/30 flex flex-col justify-between">
                  <div className="text-xs font-bold text-[#C47A5A] mb-1">
                    안전여행 확인 안내
                  </div>
                  <p className="text-[11px] text-[#2E2E2E]/80 leading-normal">
                    {plan.checklist.officialNotice}
                  </p>
                </div>
              </div>

              {/* 반려동물 해외 검역 안내 */}
              {plan.petQuarantineNotice && (
                <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#9CAF88]/30 flex items-start gap-3">
                  <Dog className="w-5 h-5 text-[#9CAF88] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-[#2E2E2E] mb-1">
                      해외 반려동물 동반 검역 절차 및 서류
                    </h5>
                    <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                      {plan.petQuarantineNotice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. 일차별 탭 선택 (Day Selector) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#9CAF88]" />
            <h3 className="text-lg font-bold text-[#2E2E2E]">일자별 상세 코스</h3>
          </div>
          <span className="text-xs text-[#2E2E2E]/50">
            마우스를 올리면 장소를 내 보드에 저장할 수 있습니다.
          </span>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {plan.days.map((day, idx) => {
            const isActive = selectedDayIndex === idx;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#2E2E2E] text-white shadow-xs"
                    : "bg-white text-[#2E2E2E]/70 border border-[#2E2E2E]/10 hover:border-[#2E2E2E]/30 hover:text-[#2E2E2E]"
                }`}
              >
                Day {day.dayNumber}
              </button>
            );
          })}
        </div>

        {/* Current Day Theme Headline */}
        <div className="p-4 rounded-2xl bg-white border border-[#2E2E2E]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-extrabold text-[#C47A5A] mr-2">
              Day {currentDay.dayNumber}
            </span>
            <span className="text-sm font-bold text-[#2E2E2E]">
              {currentDay.themeTitle}
            </span>
          </div>
          <p className="text-xs text-[#2E2E2E]/60">{currentDay.daySummary}</p>
        </div>
      </div>

      {/* 3. 핀터레스트 스타일 장소 카드 (Masonry Grid: 모바일 2열, 데스크톱 4~5열) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {currentDay.places.map((place) => {
          const isSaved = savedPlaceIds.includes(place.id);
          return (
            <div
              key={place.id}
              className="group relative bg-white rounded-2xl border border-[#2E2E2E]/10 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Header & Pin action */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[11px] font-bold text-[#9CAF88] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {place.time}
                  </span>
                  <span className="text-[10px] font-semibold text-[#2E2E2E]/50">
                    {place.category}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-[#2E2E2E] tracking-tight mb-1.5 group-hover:text-[#C47A5A] transition-colors">
                  {place.name}
                </h4>

                <p className="text-xs text-[#2E2E2E]/70 leading-relaxed mb-3 flex-1 line-clamp-3">
                  {place.description}
                </p>

                {place.highlight && (
                  <div className="mb-2 text-[11px] font-medium text-[#C47A5A] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="truncate">{place.highlight}</span>
                  </div>
                )}

                {/* 반려동물 동반 가능 배지 */}
                {place.isPetFriendly && (
                  <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#9CAF88]/15 text-[#9CAF88] text-[10px] font-bold w-fit">
                    <Dog className="w-3 h-3" />
                    <span>반려동물 동반 가능</span>
                  </div>
                )}

                {/* 예상 비용 */}
                <div className="pt-2 border-t border-[#2E2E2E]/5 flex items-center justify-between text-xs">
                  <span className="text-[#2E2E2E]/40 text-[11px]">예상 비용</span>
                  <span className="font-bold text-[#2E2E2E]">
                    {place.estimatedCost}
                  </span>
                </div>
              </div>

              {/* 다음 장소 이동 정보 바 */}
              {place.transportToNext && (
                <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#2E2E2E]/5 flex items-center gap-1.5 text-[10px] font-medium text-[#2E2E2E]/60">
                  <ArrowRight className="w-3 h-3 text-[#9CAF88] shrink-0" />
                  <span className="truncate">{place.transportToNext}</span>
                </div>
              )}

              {/* Hover / Touch Pin "저장" 버튼 (핀터레스트 무드보드 느낌) */}
              <button
                type="button"
                onClick={() =>
                  onToggleSavePlace(place, currentDay.dayNumber, currentDay.themeTitle)
                }
                className={`absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all shadow-md ${
                  isSaved
                    ? "bg-[#C47A5A] text-white opacity-100"
                    : "bg-[#2E2E2E]/80 text-white opacity-0 group-hover:opacity-100 hover:bg-[#2E2E2E]"
                }`}
                aria-label="내 보드에 핀 저장"
              >
                <Bookmark className="w-3 h-3 fill-current" />
                <span>{isSaved ? "저장됨" : "저장"}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom My Board Trigger Button */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#2E2E2E]/10">
        <div>
          <h4 className="text-sm font-bold text-[#2E2E2E]">
            마음에 드는 장소를 보관하셨나요?
          </h4>
          <p className="text-xs text-[#2E2E2E]/60">
            '내 여행 보드'에서 핀한 장소들만 모아보고 친구에게 공유할 수 있습니다.
          </p>
        </div>
        <button
          onClick={onOpenSavedModal}
          className="px-5 py-3 rounded-2xl bg-[#9CAF88] text-white font-bold text-xs hover:bg-[#8B9E78] transition-all shadow-xs flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>내 여행 보드 확인하기 ({savedPlaceIds.length})</span>
        </button>
      </div>
    </div>
  );
};
