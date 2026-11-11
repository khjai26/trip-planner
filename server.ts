import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { generateCuratedPlan } from "./src/utils/curatedPlanner.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "5mb" }));



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
