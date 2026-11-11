import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { PlannerForm } from "./components/PlannerForm";
import { LoadingView } from "./components/LoadingView";
import { ResultSection } from "./components/ResultSection";
import { MyBoardModal } from "./components/MyBoardModal";
import { PlannerFormData, TravelPlanResponse, SavedPlace, PlanPlace } from "./types/travel";
import { AlertCircle, RefreshCw, Compass } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TravelPlanResponse | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<PlannerFormData | null>(null);

  // Saved board places with localStorage persistence
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(() => {
    try {
      const stored = localStorage.getItem("wanderai_saved_places");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);

  // Sync saved places to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("wanderai_saved_places", JSON.stringify(savedPlaces));
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }
  }, [savedPlaces]);

  // Scroll to form helper
  const scrollToForm = () => {
    const el = document.getElementById("planner-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to results helper
  const scrollToResults = () => {
    const el = document.getElementById("results-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Generate travel plan API call
  const generatePlan = async (formData: PlannerFormData) => {
    setIsLoading(true);
    setError(null);
    setLastSubmittedData(formData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "여행 일정을 생성하는 중 오류가 발생했습니다.");
      }

      setCurrentPlan(result.data);
      setTimeout(() => {
        scrollToResults();
      }, 50);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Plan creation error:", err);
      if (err.name === "AbortError") {
        setError("일정 생성 시간이 초과되었습니다. 다시 시도해주세요.");
      } else {
        setError(
          err?.message ||
            "일정을 생성하는 과정에서 일시적인 통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle saving a place to board
  const handleToggleSavePlace = (
    place: PlanPlace,
    dayNumber: number,
    dayTheme: string
  ) => {
    setSavedPlaces((prev) => {
      const exists = prev.some((p) => p.id === place.id);
      if (exists) {
        return prev.filter((p) => p.id !== place.id);
      } else {
        const newSaved: SavedPlace = {
          ...place,
          dayNumber,
          dayTheme,
          tripDestination: currentPlan?.destination || "",
          savedAt: Date.now(),
        };
        return [newSaved, ...prev];
      }
    });
  };

  // Remove place from board
  const handleRemoveSavedPlace = (id: string) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  // Clear entire board
  const handleClearBoard = () => {
    if (window.confirm("저장된 장소들을 모두 비우시겠습니까?")) {
      setSavedPlaces([]);
    }
  };

  // Reset current plan
  const handleReset = () => {
    setCurrentPlan(null);
    setError(null);
    setTimeout(() => {
      scrollToForm();
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2E2E2E] flex flex-col selection:bg-[#9CAF88]/30">
      {/* Global Top Bar */}
      <Header
        savedCount={savedPlaces.length}
        onOpenSavedModal={() => setIsBoardModalOpen(true)}
        onScrollToForm={scrollToForm}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <HeroSection onScrollToForm={scrollToForm} />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Banner with Retry */}
          {error && (
            <div className="max-w-3xl mx-auto mb-8 p-5 rounded-3xl bg-[#D8A7A0]/20 border border-[#D8A7A0]/40 flex items-start justify-between gap-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#C47A5A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#2E2E2E]">
                    일정을 생성하지 못했습니다
                  </h4>
                  <p className="text-xs text-[#2E2E2E]/70 mt-1 leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
              {lastSubmittedData && (
                <button
                  type="button"
                  onClick={() => generatePlan(lastSubmittedData)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#2E2E2E]/10 text-xs font-bold text-[#2E2E2E] hover:border-[#9CAF88] hover:text-[#9CAF88] transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>다시 시도</span>
                </button>
              )}
            </div>
          )}

          {/* Loading View */}
          {isLoading ? (
            <LoadingView onCancel={() => setIsLoading(false)} />
          ) : currentPlan ? (
            /* Result Section */
            <div id="results-section" className="scroll-mt-20">
              <ResultSection
                plan={currentPlan}
                savedPlaceIds={savedPlaces.map((p) => p.id)}
                onToggleSavePlace={handleToggleSavePlace}
                onReset={handleReset}
                onOpenSavedModal={() => setIsBoardModalOpen(true)}
              />
            </div>
          ) : (
            /* Input Form */
            <PlannerForm onSubmit={generatePlan} isLoading={isLoading} />
          )}
        </div>
      </main>

      {/* My Travel Board Modal */}
      <MyBoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        savedPlaces={savedPlaces}
        onRemovePlace={handleRemoveSavedPlace}
        onClearBoard={handleClearBoard}
      />

      {/* Aesthetic Quiet Footer */}
      <footer className="border-t border-[#2E2E2E]/10 py-10 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2E2E2E]/60">
          <div className="flex items-center gap-2 font-semibold text-[#2E2E2E]">
            <Compass className="w-4 h-4 text-[#9CAF88]" />
            <span>WanderAI</span>
            <span className="text-[#2E2E2E]/30 font-normal">·</span>
            <span className="font-normal text-[#2E2E2E]/50">
              AI Travel Planner for Aesthetic Explorers
            </span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#2E2E2E]/40">
            실제 여행 일정과 물가, 영업 정보는 현지 사정에 따라 달라질 수 있습니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
