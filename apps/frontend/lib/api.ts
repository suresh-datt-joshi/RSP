import {
  AdviceResponse,
  YieldPrediction
} from "@/types";

interface YieldPredictionApiResponse {
  predicted_yield: number;
  unit: "tons_per_hectare";
  confidence: number;
  baseline_yield: number;
  historical_yields: Array<{ season: string; yield_t_per_ha: number }>;
  risk_alerts: string[];
  recommended_practices: string[];
  weather_outlook: {
    summary: string;
    rainfallOutlook: string;
    temperatureTrend: string;
  };
}

interface AdviceApiResponse {
  knowledge_base: Array<{
    title: string;
    summary: string;
    actions: string[];
    category: "soil" | "water" | "nutrition" | "pest";
  }>;
}

export const mapPrediction = (
  payload: YieldPredictionApiResponse
): YieldPrediction => ({
  predictedYield: payload.predicted_yield,
  unit: payload.unit,
  confidence: payload.confidence,
  baselineYield: payload.baseline_yield,
  historicalYields: payload.historical_yields.map((point) => ({
    season: point.season,
    yield: point.yield_t_per_ha
  })),
  riskAlerts: payload.risk_alerts,
  recommendedPractices: payload.recommended_practices,
  weatherOutlook: payload.weather_outlook
});

export const mapAdvice = (payload: AdviceApiResponse): AdviceResponse => ({
  knowledgeBase: payload.knowledge_base.map((item) => ({
    title: item.title,
    summary: item.summary,
    actions: item.actions,
    category: item.category
  }))
});

