import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Wallet,
  Heart,
  Dog,
  Check,
  Plane,
  AlertCircle,
  MapPin,
  Car,
  Key,
  Train,
  Bus,
  Footprints,
  CarTaxiFront,
  Sparkles,
} from "lucide-react";
import {
  PlannerFormData,
  TravelType,
} from "../types/travel";
import {
  TRAVEL_KEYWORDS,
  TRAVEL_PURPOSES,
  DOMESTIC_REGIONS,
  DOMESTIC_TRANSPORTS,
  OVERSEAS_AIRPORTS,
  OVERSEAS_CONTINENTS,
  OVERSEAS_LOCAL_TRANSPORTS,
  ACCOMMODATION_STYLES,
} from "../data/travelOptions";

interface PlannerFormProps {
  onSubmit: (data: PlannerFormData) => void;
  isLoading: boolean;
}

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  // Today's date string for min date (YYYY-MM-DD)
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Default initial form state
  const [type, setType] = useState<TravelType>("domestic");
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [durationNights, setDurationNights] = useState<number>(2); // 2박 3일 default
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  const [budgetDisplay, setBudgetDisplay] = useState<string>("800,000");
  const [budgetPerPerson, setBudgetPerPerson] = useState<boolean>(true);
  const [includeFlight, setIncludeFlight] = useState<boolean>(true);

  const [purpose, setPurpose] = useState<string>("힐링");
  const [hasPet, setHasPet] = useState<boolean>(false);
  const [petType, setPetType] = useState<"강아지" | "고양이" | "기타">("강아지");
  const [petSize, setPetSize] = useState<"소형" | "중형" | "대형">("소형");

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    "맛집",
    "카페",
    "힐링",
  ]);

  // Domestic specifics
  const [domesticRegion, setDomesticRegion] = useState<string>("제주특별자치도");
  const [domesticDestination, setDomesticDestination] = useState<string>("");
  const [domesticTransports, setDomesticTransports] = useState<string[]>([
    "렌터카",
  ]);

  // Overseas specifics
  const [overseasAirport, setOverseasAirport] = useState<string>("인천국제공항 (ICN)");
  const [selectedContinent, setSelectedContinent] = useState<string>("일본");
  const [overseasDestination, setOverseasDestination] = useState<string>("");
  const [flightPreference, setFlightPreference] = useState<"직항만" | "경유 가능">("직항만");
  const [overseasLocalTransports, setOverseasLocalTransports] = useState<string[]>([
    "대중교통",
  ]);
  const [accommodationStyle, setAccommodationStyle] = useState<string>("호텔");

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const numericBudget = parseInt(budgetDisplay.replace(/,/g, ""), 10) || 0;
  const durationDays = durationNights + 1;
  const totalTravelers = adults + children + infants;

  // Handle budget input with auto-formatting
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    if (!rawVal) {
      setBudgetDisplay("");
      return;
    }
    const num = parseInt(rawVal, 10);
    setBudgetDisplay(num.toLocaleString("ko-KR"));
  };

  // Toggle keyword selection
  const toggleKeyword = (name: string) => {
    if (selectedKeywords.includes(name)) {
      if (selectedKeywords.length === 1) return; // Keep at least one
      setSelectedKeywords(selectedKeywords.filter((k) => k !== name));
    } else {
      setSelectedKeywords([...selectedKeywords, name]);
    }
  };

  // Toggle transport options
  const toggleDomesticTransport = (name: string) => {
    if (domesticTransports.includes(name)) {
      if (domesticTransports.length === 1) return;
      setDomesticTransports(domesticTransports.filter((t) => t !== name));
    } else {
      setDomesticTransports([...domesticTransports, name]);
    }
  };

  const toggleOverseasTransport = (name: string) => {
    if (overseasLocalTransports.includes(name)) {
      if (overseasLocalTransports.length === 1) return;
      setOverseasLocalTransports(overseasLocalTransports.filter((t) => t !== name));
    } else {
      setOverseasLocalTransports([...overseasLocalTransports, name]);
    }
  };

  // Check if overseas budget looks low
  const perPersonBudget = budgetPerPerson
    ? numericBudget
    : numericBudget / (totalTravelers || 1);
  const isOverseasLowBudget =
    type === "overseas" && numericBudget > 0 && perPersonBudget < 450000;

  // Submit validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!startDate) {
      newErrors.startDate = "출발 날짜를 선택해주세요.";
    }
    if (adults < 1) {
      newErrors.travelers = "성인 1명 이상이어야 합니다.";
    }
    if (!numericBudget || numericBudget <= 0) {
      newErrors.budget = "예산을 입력해주세요.";
    }
    if (selectedKeywords.length === 0) {
      newErrors.keywords = "여행 키워드를 1개 이상 선택해주세요.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload: PlannerFormData = {
      type,
      startDate,
      durationNights,
      durationDays,
      travelers: {
        adults,
        children,
        infants,
      },
      budget: numericBudget,
      budgetPerPerson,
      includeFlight,
      purpose,
      pet: {
        hasPet,
        petType,
        petSize,
      },
      keywords: selectedKeywords,
      domestic: {
        departureRegion: domesticRegion,
        destination: domesticDestination.trim(),
        transport: domesticTransports,
      },
      overseas: {
        departureAirport: overseasAirport,
        continent: selectedContinent,
        destination: overseasDestination.trim(),
        flightPreference,
        localTransport: overseasLocalTransports,
        accommodationStyle,
      },
    };

    onSubmit(payload);
  };

  return (
    <div id="planner-form-section" className="scroll-mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-[#2E2E2E]/10 p-5 sm:p-8 md:p-10 shadow-xs max-w-4xl mx-auto"
      >
        {/* ★ [0] 여행 유형 선택 (폼 최상단) */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-[#2E2E2E]/60 uppercase tracking-wider mb-2">
            step 01 · 여행 유형 선택
          </label>
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#2E2E2E]/5">
            <button
              type="button"
              onClick={() => {
                setType("domestic");
                if (budgetDisplay === "1,500,000") setBudgetDisplay("600,000");
              }}
              className={`flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl text-base font-bold transition-all ${
                type === "domestic"
                  ? "bg-white text-[#2E2E2E] shadow-sm border border-[#2E2E2E]/5"
                  : "text-[#2E2E2E]/50 hover:text-[#2E2E2E]"
              }`}
            >
              <span className="text-xl">🇰🇷</span>
              <span>국내여행</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType("overseas");
                if (budgetDisplay === "600,000") setBudgetDisplay("1,500,000");
              }}
              className={`flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl text-base font-bold transition-all ${
                type === "overseas"
                  ? "bg-white text-[#2E2E2E] shadow-sm border border-[#2E2E2E]/5"
                  : "text-[#2E2E2E]/50 hover:text-[#2E2E2E]"
              }`}
            >
              <span className="text-xl">🌏</span>
              <span>해외여행</span>
            </button>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-t border-[#2E2E2E]/5 mb-8" />

        {/* [공통 항목] 날짜 및 여행 기간 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 출발 날짜 */}
          <div id="field-startDate">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#2E2E2E]">
                <Calendar className="w-4 h-4 text-[#9CAF88]" />
                출발 날짜
              </label>
              <span className="text-xs text-[#2E2E2E]/50">오늘 이후 선택</span>
            </div>
            <input
              type="date"
              min={todayStr}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10 text-[#2E2E2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#9CAF88]/50 focus:border-[#9CAF88] transition-all"
            />
            {errors.startDate && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.startDate}
              </p>
            )}
          </div>

          {/* 여행 기간 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#2E2E2E]">
                <Clock className="w-4 h-4 text-[#9CAF88]" />
                여행 기간
              </label>
              <span className="text-sm font-bold text-[#C47A5A]">
                {durationNights}박 {durationDays}일
              </span>
            </div>
            <div className="flex items-center gap-3 bg-[#FAF8F5] p-2 rounded-2xl border border-[#2E2E2E]/10">
              <button
                type="button"
                onClick={() => setDurationNights((prev) => Math.max(1, prev - 1))}
                disabled={durationNights <= 1}
                className="w-10 h-10 rounded-xl bg-white border border-[#2E2E2E]/5 text-lg font-bold text-[#2E2E2E] disabled:opacity-40 hover:bg-[#FAF8F5] flex items-center justify-center transition-all"
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={14}
                value={durationNights}
                onChange={(e) => setDurationNights(parseInt(e.target.value, 10))}
                className="flex-1 accent-[#9CAF88] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setDurationNights((prev) => Math.min(14, prev + 1))}
                disabled={durationNights >= 14}
                className="w-10 h-10 rounded-xl bg-white border border-[#2E2E2E]/5 text-lg font-bold text-[#2E2E2E] disabled:opacity-40 hover:bg-[#FAF8F5] flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-[#2E2E2E]/50 text-right">
              최대 14박 15일까지 설계 가능
            </p>
          </div>
        </div>

        {/* 인원 선택 스테퍼 */}
        <div id="field-travelers" className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-[#2E2E2E]">
              <Users className="w-4 h-4 text-[#9CAF88]" />
              여행 인원
            </label>
            <span className="text-xs text-[#2E2E2E]/60">
              총 {totalTravelers}명
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 성인 */}
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#2E2E2E]/10">
              <div>
                <p className="text-xs font-bold text-[#2E2E2E]">성인</p>
                <p className="text-[10px] text-[#2E2E2E]/50">만 12세 이상</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-[#2E2E2E]/10 flex items-center justify-center font-bold text-[#2E2E2E] hover:bg-slate-50 transition-all"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-[#2E2E2E] tabular-nums">
                  {adults}
                </span>
                <button
                  type="button"
                  onClick={() => setAdults((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-[#2E2E2E]/10 flex items-center justify-center font-bold text-[#2E2E2E] hover:bg-slate-50 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* 아동 */}
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#2E2E2E]/10">
              <div>
                <p className="text-xs font-bold text-[#2E2E2E]">아동</p>
                <p className="text-[10px] text-[#2E2E2E]/50">만 2세 ~ 11세</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-[#2E2E2E]/10 flex items-center justify-center font-bold text-[#2E2E2E] hover:bg-slate-50 transition-all"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-[#2E2E2E] tabular-nums">
                  {children}
                </span>
                <button
                  type="button"
                  onClick={() => setChildren((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-[#2E2E2E]/10 flex items-center justify-center font-bold text-[#2E2E2E] hover:bg-slate-50 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* 유아 */}
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#2E2E2E]/10">
              <div>
                <p className="text-xs font-bold text-[#2E2E2E]">유아</p>
                <p className="text-[10px] text-[#2E2E2E]/50">만 24개월 미만</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-[#2E2E2E]/10 flex items-center justify-center font-bold text-[#2E2E2E] hover:bg-slate-50 transition-all"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-[#2E2E2E] tabular-nums">
                  {infants}
                </span>
                <button
                  type="button"
                  onClick={() => setInfants((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-[#2E2E2E]/10 flex items-center justify-center font-bold text-[#2E2E2E] hover:bg-slate-50 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {errors.travelers && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.travelers}
            </p>
          )}
        </div>

        {/* 예산 입력 */}
        <div id="field-budget" className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-[#2E2E2E]">
              <Wallet className="w-4 h-4 text-[#9CAF88]" />
              여행 예산 (원화 기준)
            </label>
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#2E2E2E]/10 text-xs">
              <button
                type="button"
                onClick={() => setBudgetPerPerson(true)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  budgetPerPerson
                    ? "bg-white text-[#2E2E2E] shadow-xs font-semibold"
                    : "text-[#2E2E2E]/50 hover:text-[#2E2E2E]"
                }`}
              >
                1인 기준
              </button>
              <button
                type="button"
                onClick={() => setBudgetPerPerson(false)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  !budgetPerPerson
                    ? "bg-white text-[#2E2E2E] shadow-xs font-semibold"
                    : "text-[#2E2E2E]/50 hover:text-[#2E2E2E]"
                }`}
              >
                전체 기준
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={budgetDisplay}
              onChange={handleBudgetChange}
              placeholder="예: 800,000"
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10 text-[#2E2E2E] text-base font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#9CAF88]/50 focus:border-[#9CAF88] transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#2E2E2E]/60">
              원
            </span>
          </div>

          {/* 해외여행 전용: 항공권 포함 / 항공권 제외 토글 */}
          {type === "overseas" && (
            <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10">
              <span className="text-xs font-medium text-[#2E2E2E]">
                항공권 비용 포함 여부
              </span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#2E2E2E]/10 text-xs">
                <button
                  type="button"
                  onClick={() => setIncludeFlight(true)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    includeFlight
                      ? "bg-[#9CAF88] text-white font-semibold shadow-xs"
                      : "text-[#2E2E2E]/60"
                  }`}
                >
                  항공권 포함
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeFlight(false)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    !includeFlight
                      ? "bg-[#9CAF88] text-white font-semibold shadow-xs"
                      : "text-[#2E2E2E]/60"
                  }`}
                >
                  항공권 제외 (현지 경비만)
                </button>
              </div>
            </div>
          )}

          {/* 해외여행 저예산 알림 배너 */}
          {isOverseasLowBudget && (
            <div className="mt-3 p-3.5 rounded-2xl bg-[#D8A7A0]/15 border border-[#D8A7A0]/30 flex items-start gap-2.5 text-xs text-[#2E2E2E]">
              <Sparkles className="w-4 h-4 text-[#C47A5A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#C47A5A]">
                  예산이 부족할 수 있어요.
                </span>{" "}
                선택하신 기간과 인원 대비 가성비 높은 근거리 여행지(일본 규슈,
                대만, 동남아 등)를 중심으로 알뜰하고 알찬 코스를 추천해드릴게요.
              </div>
            </div>
          )}

          {errors.budget && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.budget}
            </p>
          )}
        </div>

        {/* 여행 목적 (칩 버튼) */}
        <div className="mb-8">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-[#2E2E2E] mb-2.5">
            <Heart className="w-4 h-4 text-[#9CAF88]" />
            여행 목적
          </label>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_PURPOSES.map((p) => {
              const isSelected = purpose === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#2E2E2E] text-white shadow-xs scale-102"
                      : "bg-[#FAF8F5] text-[#2E2E2E]/70 border border-[#2E2E2E]/5 hover:bg-[#FAF8F5]/80 hover:text-[#2E2E2E]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* 반려동물 동반 토글 */}
        <div className="mb-8 p-4 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-white border border-[#2E2E2E]/10 flex items-center justify-center text-[#9CAF88]">
                <Dog className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#2E2E2E]">
                  반려동물 동반 여행
                </p>
                <p className="text-[11px] text-[#2E2E2E]/50">
                  반려동물 입장 가능한 식당·카페·숙소로 맞춤 구성
                </p>
              </div>
            </div>
            {/* Toggle switch */}
            <button
              type="button"
              onClick={() => setHasPet(!hasPet)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                hasPet ? "bg-[#9CAF88]" : "bg-[#2E2E2E]/20"
              }`}
              role="switch"
              aria-checked={hasPet}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  hasPet ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 반려동물 세부 옵션 */}
          {hasPet && (
            <div className="mt-4 pt-4 border-t border-[#2E2E2E]/10 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 종류 */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#2E2E2E]/70 mb-1.5">
                    반려동물 종류
                  </label>
                  <div className="flex gap-2">
                    {(["강아지", "고양이", "기타"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPetType(t)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          petType === t
                            ? "bg-white text-[#2E2E2E] border-[#9CAF88] shadow-xs"
                            : "bg-white/50 text-[#2E2E2E]/60 border-[#2E2E2E]/10"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 크기 */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#2E2E2E]/70 mb-1.5">
                    반려동물 크기
                  </label>
                  <div className="flex gap-2">
                    {(["소형", "중형", "대형"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPetSize(s)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          petSize === s
                            ? "bg-white text-[#2E2E2E] border-[#9CAF88] shadow-xs"
                            : "bg-white/50 text-[#2E2E2E]/60 border-[#2E2E2E]/10"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 해외여행 시 검역 서류 안내 배너 */}
              {type === "overseas" && (
                <div className="p-3 rounded-xl bg-[#D8A7A0]/20 border border-[#D8A7A0]/40 text-xs text-[#2E2E2E] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#C47A5A] shrink-0" />
                  <span>
                    <strong>해외 반려동물 동반은 검역·서류 준비가 필요해요.</strong>{" "}
                    (국가별 광병 항체가, 마이크로칩, 수출검역증명서 발급 필요)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 구분선 */}
        <hr className="border-t border-[#2E2E2E]/5 my-8" />

        {/* 국내여행 전용 항목 */}
        {type === "domestic" && (
          <div className="space-y-6 mb-8 animate-fadeIn">
            <h3 className="text-xs font-bold text-[#9CAF88] uppercase tracking-wider">
              국내여행 상세 옵션
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 출발 지역 */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2E2E2E] mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9CAF88]" />
                  출발 지역
                </label>
                <select
                  value={domesticRegion}
                  onChange={(e) => setDomesticRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10 text-xs font-medium text-[#2E2E2E] focus:outline-none focus:border-[#9CAF88]"
                >
                  {DOMESTIC_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* 희망 여행지 */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2E2E2E] mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C47A5A]" />
                  희망 여행지 (선택)
                </label>
                <input
                  type="text"
                  value={domesticDestination}
                  onChange={(e) => setDomesticDestination(e.target.value)}
                  placeholder="예: 강릉, 제주 애월, 여수 (비워두면 AI 추천)"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10 text-xs font-medium text-[#2E2E2E] placeholder:text-[#2E2E2E]/40 focus:outline-none focus:border-[#9CAF88]"
                />
              </div>
            </div>

            {/* 이용 교통수단 (복수 선택 아이콘 카드) */}
            <div>
              <label className="block text-xs font-semibold text-[#2E2E2E] mb-2">
                이용 교통수단 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {DOMESTIC_TRANSPORTS.map((item) => {
                  const isSelected = domesticTransports.includes(item.name);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleDomesticTransport(item.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "bg-[#2E2E2E] text-white border-[#2E2E2E] shadow-xs"
                          : "bg-[#FAF8F5] text-[#2E2E2E]/70 border-[#2E2E2E]/5 hover:border-[#2E2E2E]/20"
                      }`}
                    >
                      {item.id === "car" && <Car className="w-5 h-5 mb-1.5" />}
                      {item.id === "rental" && <Key className="w-5 h-5 mb-1.5" />}
                      {item.id === "ktx" && <Train className="w-5 h-5 mb-1.5" />}
                      {item.id === "bus" && <Bus className="w-5 h-5 mb-1.5" />}
                      {item.id === "flight" && <Plane className="w-5 h-5 mb-1.5" />}
                      {item.id === "walk" && (
                        <Footprints className="w-5 h-5 mb-1.5" />
                      )}
                      <span className="text-[11px] font-semibold">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 해외여행 전용 항목 */}
        {type === "overseas" && (
          <div className="space-y-6 mb-8 animate-fadeIn">
            <h3 className="text-xs font-bold text-[#C47A5A] uppercase tracking-wider">
              해외여행 상세 옵션
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 출발 공항 */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#2E2E2E] mb-1.5">
                  <Plane className="w-3.5 h-3.5 text-[#9CAF88]" />
                  출발 공항
                </label>
                <select
                  value={overseasAirport}
                  onChange={(e) => setOverseasAirport(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10 text-xs font-medium text-[#2E2E2E] focus:outline-none focus:border-[#9CAF88]"
                >
                  {OVERSEAS_AIRPORTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* 항공편 선호 */}
              <div>
                <label className="block text-xs font-semibold text-[#2E2E2E] mb-1.5">
                  항공편 선호
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["직항만", "경유 가능"] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setFlightPreference(pref)}
                      className={`py-3 px-3 rounded-2xl text-xs font-semibold border transition-all ${
                        flightPreference === pref
                          ? "bg-[#2E2E2E] text-white border-[#2E2E2E] shadow-xs"
                          : "bg-[#FAF8F5] text-[#2E2E2E]/60 border-[#2E2E2E]/10"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 희망 여행지: 대륙 칩 + 국가/도시 입력 */}
            <div>
              <label className="block text-xs font-semibold text-[#2E2E2E] mb-2">
                선호 대륙 및 추천 권역
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {OVERSEAS_CONTINENTS.map((c) => {
                  const isSelected = selectedContinent === c.name;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedContinent(c.name)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        isSelected
                          ? "bg-[#9CAF88] text-white border-[#9CAF88] shadow-xs"
                          : "bg-[#FAF8F5] text-[#2E2E2E]/70 border-[#2E2E2E]/5 hover:bg-white"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2E2E2E]/60 mb-1">
                  국가 / 도시 (직접 입력 또는 AI 추천)
                </label>
                <input
                  type="text"
                  value={overseasDestination}
                  onChange={(e) => setOverseasDestination(e.target.value)}
                  placeholder="예: 일본 교토, 베트남 다낭, 프랑스 파리 (비워두면 AI 추천)"
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#2E2E2E]/10 text-xs font-medium text-[#2E2E2E] placeholder:text-[#2E2E2E]/40 focus:outline-none focus:border-[#9CAF88]"
                />
              </div>
            </div>

            {/* 현지 교통수단 */}
            <div>
              <label className="block text-xs font-semibold text-[#2E2E2E] mb-2">
                현지 교통수단 (복수 선택 가능)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {OVERSEAS_LOCAL_TRANSPORTS.map((item) => {
                  const isSelected = overseasLocalTransports.includes(item.name);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleOverseasTransport(item.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? "bg-[#2E2E2E] text-white border-[#2E2E2E] shadow-xs"
                          : "bg-[#FAF8F5] text-[#2E2E2E]/70 border-[#2E2E2E]/5 hover:border-[#2E2E2E]/20"
                      }`}
                    >
                      {item.id === "public" && <Train className="w-5 h-5 mb-1.5" />}
                      {item.id === "rental" && <Car className="w-5 h-5 mb-1.5" />}
                      {item.id === "taxi" && (
                        <CarTaxiFront className="w-5 h-5 mb-1.5" />
                      )}
                      {item.id === "tourbus" && <Bus className="w-5 h-5 mb-1.5" />}
                      {item.id === "walk" && (
                        <Footprints className="w-5 h-5 mb-1.5" />
                      )}
                      <span className="text-[11px] font-semibold">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 숙소 스타일 */}
            <div>
              <label className="block text-xs font-semibold text-[#2E2E2E] mb-2">
                숙소 스타일
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCOMMODATION_STYLES.map((style) => {
                  const isSelected = accommodationStyle === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setAccommodationStyle(style)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-[#C47A5A] text-white shadow-xs"
                          : "bg-[#FAF8F5] text-[#2E2E2E]/70 border border-[#2E2E2E]/5 hover:bg-white"
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 구분선 */}
        <hr className="border-t border-[#2E2E2E]/5 my-8" />

        {/* 여행 키워드 선택 (핀터레스트 세로형 사진 카드 메이슨리 그리드) */}
        <div id="field-keywords" className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#2E2E2E]">
                <Sparkles className="w-4 h-4 text-[#9CAF88]" />
                여행 키워드 무드보드
              </label>
              <p className="text-xs text-[#2E2E2E]/50 mt-0.5">
                끌리는 테마를 탭하세요 (복수 선택 가능)
              </p>
            </div>
            <span className="text-xs font-bold text-[#9CAF88]">
              {selectedKeywords.length}개 선택됨
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {TRAVEL_KEYWORDS.map((item) => {
              const isSelected = selectedKeywords.includes(item.name);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleKeyword(item.name)}
                  className={`group relative overflow-hidden rounded-2xl text-left aspect-3/4 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-[#9CAF88] ring-offset-2 scale-[0.98] shadow-md"
                      : "hover:scale-[1.02] shadow-xs"
                  }`}
                  style={{ backgroundColor: item.fallbackColor }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).classList.add("opacity-0");
                    }}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isSelected
                        ? "brightness-75"
                        : "group-hover:scale-105 brightness-95"
                    }`}
                  />

                  {/* Gradient Scrim */}
                  <div
                    className={`absolute inset-0 transition-opacity ${
                      isSelected
                        ? "bg-black/50"
                        : "bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90"
                    }`}
                  />

                  {/* Check Indicator if selected */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#9CAF88] text-white flex items-center justify-center shadow-md animate-scaleIn">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Text on Card */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-xs sm:text-sm font-bold tracking-tight mb-0.5">
                      {item.tag}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {errors.keywords && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.keywords}
            </p>
          )}
        </div>

        {/* 하단 큰 여행 일정 만들기 버튼 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-[#2E2E2E] text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg hover:bg-[#C47A5A] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <span>여행 일정 만들기 ✈️</span>
          </button>
          <p className="text-center text-[11px] text-[#2E2E2E]/40 mt-2">
            입력하신 예산과 인원, 동선을 고려해 Gemini가 1분 만에 최적의 일정을 완성합니다.
          </p>
        </div>
      </form>
    </div>
  );
};
