export type CropType =
  | "wheat"
  | "rice"
  | "maize"
  | "cotton"
  | "soybean"
  | "sugarcane";

export type SoilType =
  | "alluvial"
  | "black"
  | "red"
  | "laterite"
  | "loamy"
  | "sandy";

export type IrrigationType = "rainfed" | "drip" | "sprinkler" | "canal";

export interface FarmerInput {
  latitude: number;
  longitude: number;
  locationName: string;
  cropType: CropType;
  soilType: SoilType;
  irrigationType: IrrigationType;
  acreage: number;
  rainfall: number;
  fertilizerUsage: number;
  sowingDate: string;
}

export interface YieldPrediction {
  predictedYield: number;
  unit: "tons_per_hectare";
  confidence: number;
  baselineYield: number;
  historicalYields: Array<{ season: string; yield: number }>;
  riskAlerts: string[];
  recommendedPractices: string[];
  weatherOutlook: {
    summary: string;
    rainfallOutlook: string;
    temperatureTrend: string;
  };
}

export interface AdviceResponse {
  knowledgeBase: Array<{
    title: string;
    summary: string;
    actions: string[];
    category: "soil" | "water" | "nutrition" | "pest";
  }>;
}

export interface ReferenceOptions {
  crops: Array<{ id: CropType; name: string; duration: string }>;
  soils: Array<{ id: SoilType; name: string; suitability: string }>;
  irrigation: Array<{ id: IrrigationType; name: string; waterUse: string }>;
}

