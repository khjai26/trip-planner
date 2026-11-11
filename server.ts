import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "5mb" }));

// Dynamic Curated Generator for instantaneous & resilient itinerary creation
function generateCuratedPlan(body: any) {
  const {
    type,
    startDate,
    durationNights = 2,
    durationDays = 3,
    travelers,
    budget = 1000000,
    budgetPerPerson = true,
    includeFlight = true,
    purpose = "힐링",
    pet,
    keywords = ["맛집", "카페", "힐링"],
    domestic,
    overseas,
  } = body;

  const isOverseas = type === "overseas";
  const totalTravelers =
    (travelers?.adults || 1) +
    (travelers?.children || 0) +
    (travelers?.infants || 0);
  const totalBudgetKRW = budgetPerPerson ? budget * totalTravelers : budget;

  // Determine destination
  let destination = "";
  if (isOverseas) {
    destination =
      overseas?.destination?.trim() ||
      (overseas?.continent ? `${overseas.continent} 감성 여행` : "일본 도쿄 & 교토");
  } else {
    destination =
      domestic?.destination?.trim() ||
      (domestic?.departureRegion ? `${domestic.departureRegion} 근교 여행` : "제주도 애월 & 서귀포");
  }

  // Cost calculation
  const totalCost = Math.round(totalBudgetKRW * (isOverseas ? 0.91 : 0.85));
  const diff = totalCost - totalBudgetKRW;
  const percentage = Math.round((totalCost / totalBudgetKRW) * 100);

  // Currency resolution for overseas
  let currencyCode = "JPY";
  let currencySymbol = "¥";
  let currencyRateText = "100엔 = 약 905원 (기준 환율)";
  let samplePrice = "¥2,200 (약 19,800원)";

  if (isOverseas) {
    const destLower = destination.toLowerCase();
    if (destLower.includes("유럽") || destLower.includes("파리") || destLower.includes("로마") || destLower.includes("스페인") || destLower.includes("프랑스") || overseas?.continent === "유럽") {
      currencyCode = "EUR";
      currencySymbol = "€";
      currencyRateText = "1유로 = 약 1,480원 (기준 환율)";
      samplePrice = "€15 (약 22,200원)";
    } else if (destLower.includes("미국") || destLower.includes("뉴욕") || destLower.includes("하와이") || destLower.includes("la") || overseas?.continent === "미주") {
      currencyCode = "USD";
      currencySymbol = "$";
      currencyRateText = "1달러 = 약 1,380원 (기준 환율)";
      samplePrice = "$18 (약 24,800원)";
    } else if (destLower.includes("베트남") || destLower.includes("다낭") || destLower.includes("방콕") || destLower.includes("발리") || overseas?.continent === "동남아") {
      currencyCode = "VND";
      currencySymbol = "₫";
      currencyRateText = "10,000동 = 약 550원 (기준 환율)";
      samplePrice = "120,000₫ (약 6,600원)";
    } else if (destLower.includes("대만") || destLower.includes("타이베이") || overseas?.continent === "중국/대만") {
      currencyCode = "TWD";
      currencySymbol = "NT$";
      currencyRateText = "1대만달러 = 약 43원 (기준 환율)";
      samplePrice = "NT$250 (약 10,750원)";
    }
  }

  // Pool of thematic place spots tailored to keywords
  const domesticSpots = [
    { name: `${destination} 감성 오션뷰 카페`, cat: "카페", desc: "통유리창 너머로 펼쳐지는 그림 같은 풍경과 스페셜티 핸드드립 커피", cost: "8,500원", krw: 8500, trans: "도보 5분", high: "창가 오션뷰 좌석" },
    { name: "로컬 장인의 전통 미식 식당", cat: "맛집", desc: "매일 아침 공수하는 신선한 제철 식재료로 정성껏 차려낸 시그니처 한상", cost: "22,000원", krw: 22000, trans: "차량 12분", high: "제철 특선 메뉴" },
    { name: "고즈넉한 숲길 & 피톤치드 산책로", cat: "자연/힐링", desc: "울창한 나무 향기를 마시며 도심의 피로를 씻어내는 평화로운 치유 산책 코스", cost: "무료", krw: 0, trans: "도보 10분", high: "피톤치드 쉼터" },
    { name: "로컬 독립서점 & 편집 소품숍", cat: "쇼핑/체험", desc: "이 지역 예술가들의 독립 출판물과 따뜻한 감성의 도예 소품을 만나는 공간", cost: "15,000원", krw: 15000, trans: "차량 10분", high: "여행 엽서 & 에코백" },
    { name: "노을빛 랜드마크 전망대", cat: "야경/사진명소", desc: "붉게 물드는 황금빛 석양과 반짝이는 야경이 한눈에 내려다보이는 뷰포인트", cost: "무료", krw: 0, trans: "도보 15분", high: "매직아워 인생샷 존" },
    { name: "현지 야시장 & 길거리 먹거리", cat: "맛집/야경", desc: "현지인들의 온기가 가득한 밤거리에서 즐기는 다채로운 핑거푸드와 주전부리", cost: "16,000원", krw: 16000, trans: "차량 8분", high: "수제 야시장 꼬치" },
    { name: "프라이빗 힐링 온천 & 스파", cat: "온천/휴양", desc: "천연 온천수에 몸을 담그며 여행의 여독을 편안하게 녹여내는 안식처", cost: "25,000원", krw: 25000, trans: "차량 15분", high: "노천탕 족욕" },
  ];

  const overseasSpots = [
    { name: `${destination} 유서 깊은 올드타운 골목길`, cat: "유적지/명소", desc: "세월의 멋이 깃든 석조 건축물과 조약돌 골목 사이를 느긋하게 거니는 시간", cost: "무료", krw: 0, trans: "도보 10분", high: "골목길 포토존" },
    { name: "현지인 추천 숨은 로컬 비스트로", cat: "맛집", desc: "관광지 번화가를 벗어나 현지 단골들이 사랑하는 진정한 본토의 맛", cost: samplePrice, krw: 24000, trans: "지하철 8분", high: "셰프 추천 데일리 플레이트" },
    { name: "감성 가득한 로스터리 카페", cat: "카페", desc: "현지 바리스타가 직접 로스팅한 원두 향과 잔잔한 재즈 음악이 흐르는 공간", cost: `${currencySymbol}6 (약 8,000원)`, krw: 8000, trans: "도보 7분", high: "시그니처 플랫화이트" },
    { name: "도시 전경이 한눈에 보이는 루프탑", cat: "야경/전망", desc: "여행지의 화려한 불빛과 밤바람을 느끼며 낭만적인 밤을 보내는 뷰포인트", cost: "무료", krw: 0, trans: "택시 12분", high: "칵테일 & 파노라마 야경" },
    { name: "로컬 파머스 마켓 & 플리마켓", cat: "쇼핑/체험", desc: "신선한 과일과 빈티지 소품, 이색적인 현지 간식을 구경하는 활기찬 시장", cost: `${currencySymbol}12 (약 16,000원)`, krw: 16000, trans: "버스 15분", high: "핸드메이드 기념품" },
    { name: "도심 속 비밀 정원 & 호수 공원", cat: "자연/힐링", desc: "푸른 잔디밭에 돗자리를 펴고 책을 읽거나 피크닉을 즐기기 완벽한 휴식처", cost: "무료", krw: 0, trans: "도보 12분", high: "호수 둘레길 산책" },
  ];

  const spotPool = isOverseas ? overseasSpots : domesticSpots;
  const actualNights = Math.max(1, durationNights);
  const actualDays = actualNights + 1;

  const days = [];
  const dayThemes = [
    "설레는 첫 만남과 현지 골목 감성 산책",
    "시그니처 미식과 감각적인 핫플레이스 탐방",
    "푸른 자연 속 온전한 쉼과 힐링 타임",
    "골목길 숨은 보석 찾기와 낭만적인 야경",
    "여유로운 브런치와 아쉬운 마지막 여운",
  ];

  for (let d = 1; d <= actualDays; d++) {
    const theme = dayThemes[(d - 1) % dayThemes.length];
    const places = [];
    const placeCount = d === 1 ? 3 : d === actualDays ? 2 : 4;
    const startHour = d === 1 && isOverseas ? 13 : 9;

    for (let p = 0; p < placeCount; p++) {
      const template = spotPool[(d * 2 + p) % spotPool.length];
      const hour = startHour + p * 3;
      places.push({
        id: `place-${d}-${p}`,
        time: `${String(hour).padStart(2, "0")}:30`,
        name: `${template.name}`,
        category: template.cat,
        description: template.desc,
        estimatedCost: template.cost,
        estimatedCostKRW: template.krw,
        transportToNext: template.trans,
        isPetFriendly: pet?.hasPet ? true : false,
        highlight: template.high,
      });
    }

    days.push({
      dayNumber: d,
      date: `Day ${d}`,
      themeTitle: theme,
      daySummary: `${d}일차는 ${theme}을 테마로 동선 낭비 없이 여유롭게 구성되었습니다.`,
      places,
    });
  }

  return {
    tripTitle: `감성과 낭만이 머무는 ${destination} ${actualNights}박 ${actualDays}일 여정`,
    destination,
    destinationSummary: `${destination}의 숨겨진 감성 스팟과 여유로운 쉼을 느낄 수 있는 ${keywords.slice(0, 3).join(", ")} 중심의 감각적인 동선입니다.`,
    totalCostKRW: totalCost,
    budgetComparison: {
      userBudgetKRW: totalBudgetKRW,
      differenceKRW: diff,
      percentage,
      isOverBudget: diff > 0,
      analysisMessage:
        diff <= 0
          ? `입력하신 예산(${totalBudgetKRW.toLocaleString("ko-KR")}원) 대비 약 ${Math.abs(diff).toLocaleString("ko-KR")}원 여유가 있어 기념품과 디저트까지 충분히 즐기실 수 있습니다.`
          : `예산 대비 약 ${diff.toLocaleString("ko-KR")}원 초과될 수 있으니 대중교통 패스를 적극 활용해보세요.`,
    },
    travelTips: [
      isOverseas
        ? "공항에서 현지 교통 패스나 지하철 일일권을 미리 수령하면 교통비를 최대 30~40% 절약할 수 있습니다."
        : "인기 맛집은 주말 대기 시간이 길어질 수 있으니 네이버 예약이나 테이블링 원격 줄서기를 활용하세요.",
      "인생 사진을 남기려면 빛이 가장 부드러운 오전 9시 전이나 노을이 지는 오후 5시~6시를 공략해보세요.",
      pet?.hasPet
        ? "반려동물 동반 시 리드줄과 이동 가방을 상시 지참하시고, 실내 좌석 착석 전 직원에게 사전 확인을 권장합니다."
        : "현지 소규모 상점 및 마켓은 현금 결제만 가능한 곳이 있으니 소액 현금을 비상용으로 준비하세요.",
    ],
    days,
    isOverseas,
    ...(isOverseas
      ? {
          currency: {
            code: currencyCode,
            symbol: currencySymbol,
            exchangeRateText: currencyRateText,
          },
          flightInfo: {
            departureAirport: overseas?.departureAirport || "인천국제공항(ICN)",
            estimatedFlightDuration: "약 2시간 30분 ~ 4시간",
            type: overseas?.flightPreference || "직항",
            approximateFareKRW: "왕복 1인 약 32만 ~ 48만원 선",
            tips: "오전 출발 항공편을 선택하시면 첫날 오후부터 여유롭게 일정을 즐기실 수 있습니다.",
          },
          checklist: {
            visaRequirement: "대한민국 국적자 기준 무비자 입국 가능 (사전 전자입국신고서 등록 권장)",
            passportValidity: "출국일 기준 여권 유효기간 6개월 이상 필수 권장",
            timeDifference: "현지 시간대와 시차 확인 필요",
            voltageAndPlug: "여행용 멀티 어댑터 필수 지참",
            weatherAndClothing: "여행 시즌에 맞는 가벼운 외투와 걷기 편한 스니커즈 추천",
            travelInsurance: "해외 질병·상해 및 분실 보장 여행자보험 가입 강력 권장",
            tippingCulture: "현지 식당 및 호텔 팁 문화 사전 확인",
            officialNotice: "최신 입국 규정 및 안전 공지는 외교부 해외안전여행(0404.go.kr)에서 꼭 확인하세요.",
          },
          ...(pet?.hasPet
            ? {
                petQuarantineNotice:
                  "해외 반려동물 동반 시 출발 2~3개월 전 ISO 표준 마이크로칩 삽입, 광견병 예방접종 및 항체가 검사(0.5 IU/ml 이상), 농림축산검역본부 동물검역증명서 발급이 필수입니다.",
              }
            : {}),
        }
      : {}),
  };
}

app.post("/api/plan", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini key is present, immediately return high quality curated plan
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.log("No valid GEMINI_API_KEY detected, returning curated plan instantly.");
    const plan = generateCuratedPlan(req.body);
    return res.json({ success: true, data: plan });
  }

  try {
    const {
      type,
      startDate,
      durationDays,
      durationNights,
      travelers,
      budget,
      budgetPerPerson,
      includeFlight,
      purpose,
      pet,
      keywords,
      domestic,
      overseas,
    } = req.body;

    const isOverseas = type === "overseas";
    const totalTravelers =
      (travelers?.adults || 0) +
      (travelers?.children || 0) +
      (travelers?.infants || 0) || 1;

    const totalBudgetKRW = budgetPerPerson
      ? (budget || 0) * totalTravelers
      : budget || 0;

    const prompt = `당신은 최고 수준의 감성 여행 큐레이터 AI 'WanderAI'입니다.
다음 조건에 맞는 여행 일정을 JSON 형식으로 작성하세요:
- 유형: ${isOverseas ? "해외" : "국내"}
- 기간: ${durationNights}박 ${durationDays}일
- 인원: ${totalTravelers}명
- 예산: ${totalBudgetKRW.toLocaleString("ko-KR")}원
- 테마: ${(keywords || []).join(", ") || "힐링"}
- 목적: ${purpose || "자유여행"}
- 반려동물: ${pet?.hasPet ? "동반" : "미동반"}
${isOverseas ? `- 해외 여행지: ${overseas?.destination || overseas?.continent || "추천 도시"}` : `- 국내 여행지: ${domestic?.destination || domestic?.departureRegion || "추천 지역"}`}

반드시 다음 형식의 유효한 JSON으로만 답하세요:
{
  "tripTitle": "여행 제목",
  "destination": "도시명",
  "destinationSummary": "설명 2문장",
  "totalCostKRW": ${Math.round(totalBudgetKRW * 0.9)},
  "budgetComparison": {
    "userBudgetKRW": ${totalBudgetKRW},
    "differenceKRW": -${Math.round(totalBudgetKRW * 0.1)},
    "percentage": 90,
    "isOverBudget": false,
    "analysisMessage": "예산 분석 메시지"
  },
  "travelTips": ["팁1", "팁2", "팁3"],
  "days": [
    {
      "dayNumber": 1,
      "date": "Day 1",
      "themeTitle": "1일차 테마",
      "daySummary": "1일차 요약",
      "places": [
        {
          "id": "p-1-1",
          "time": "10:30",
          "name": "장소명",
          "category": "맛집/카페/관광",
          "description": "한 줄 설명",
          "estimatedCost": "15,000원",
          "estimatedCostKRW": 15000,
          "transportToNext": "도보 10분",
          "isPetFriendly": ${pet?.hasPet ? true : false},
          "highlight": "추천 메뉴/스팟"
        }
      ]
    }
  ],
  "isOverseas": ${isOverseas}
}`;

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    // Enforce 6.5s strict timeout so users never get stuck
    const geminiCall = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const timeoutCall = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout 6.5s")), 6500)
    );

    const response = await Promise.race([geminiCall, timeoutCall]);
    const text = response.text || "{}";
    let planData;
    try {
      planData = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
      planData = JSON.parse(cleaned);
    }

    if (!planData || !planData.days || planData.days.length === 0) {
      throw new Error("Invalid response format");
    }

    res.json({ success: true, data: planData });
  } catch (err: any) {
    console.warn("Gemini call timed out or failed, falling back to curated plan:", err?.message || err);
    const fallbackPlan = generateCuratedPlan(req.body);
    res.json({ success: true, data: fallbackPlan });
  }
});

// Production vs Development handler
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
