"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import LocationSelector from "@/components/LocationSelector";
import ParameterForm from "@/components/ParameterForm";
import YieldSummary from "@/components/YieldSummary";
import InsightsPanel from "@/components/InsightsPanel";
import {
  AdviceResponse,
  FarmerInput,
  ReferenceOptions,
  YieldPrediction
} from "@/types";
import { mapAdvice, mapPrediction } from "@/lib/api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const DEFAULT_REFERENCE_OPTIONS: ReferenceOptions = {
  crops: [
    { id: "wheat", name: "Wheat", duration: "120-150 days" },
    { id: "rice", name: "Rice", duration: "110-135 days" },
    { id: "maize", name: "Maize", duration: "90-110 days" },
    { id: "cotton", name: "Cotton", duration: "150-180 days" },
    { id: "soybean", name: "Soybean", duration: "90-110 days" },
    { id: "sugarcane", name: "Sugarcane", duration: "270-365 days" }
  ],
  soils: [
    { id: "alluvial", name: "Alluvial", suitability: "High fertility" },
    { id: "black", name: "Black", suitability: "Moisture retentive" },
    { id: "red", name: "Red", suitability: "Well-drained" },
    { id: "laterite", name: "Laterite", suitability: "Requires inputs" },
    { id: "loamy", name: "Loamy", suitability: "Versatile" },
    { id: "sandy", name: "Sandy", suitability: "Low retention" }
  ],
  irrigation: [
    { id: "rainfed", name: "Rainfed", waterUse: "Seasonal rainfall" },
    { id: "drip", name: "Drip", waterUse: "High efficiency" },
    { id: "sprinkler", name: "Sprinkler", waterUse: "Moderate efficiency" },
    { id: "canal", name: "Canal", waterUse: "Surface irrigation" }
  ]
};

const initialInput: FarmerInput = {
  latitude: 20.5937,
  longitude: 78.9629,
  locationName: "My Farm",
  cropType: "wheat",
  soilType: "alluvial",
  irrigationType: "canal",
  acreage: 1.5,
  rainfall: 80,
  fertilizerUsage: 45,
  sowingDate: new Date().toISOString().slice(0, 10)
};

const toApiFarmerPayload = (input: FarmerInput) => ({
  latitude: input.latitude,
  longitude: input.longitude,
  location_name: input.locationName.trim() || "Field",
  crop_type: input.cropType,
  soil_type: input.soilType,
  irrigation_type: input.irrigationType,
  acreage: input.acreage,
  rainfall: input.rainfall,
  fertilizer_usage: input.fertilizerUsage,
  sowing_date: input.sowingDate
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const cropBaselines: Record<FarmerInput["cropType"], number> = {
  wheat: 3.2,
  rice: 4.5,
  maize: 4.1,
  cotton: 2.8,
  soybean: 2.5,
  sugarcane: 75
};

const irrigationImpact: Record<FarmerInput["irrigationType"], number> = {
  rainfed: 0.9,
  drip: 1.1,
  sprinkler: 1.05,
  canal: 1
};

const soilImpact: Record<FarmerInput["soilType"], number> = {
  alluvial: 1.1,
  black: 1.05,
  red: 0.95,
  laterite: 0.9,
  loamy: 1,
  sandy: 0.85
};

const generateOfflinePrediction = (input: FarmerInput): YieldPrediction => {
  const baseline = cropBaselines[input.cropType];
  const irrigationFactor = irrigationImpact[input.irrigationType];
  const soilFactor = soilImpact[input.soilType];

  const rainfallFactor = clamp(0.75 + input.rainfall / 300, 0.6, 1.25);
  const fertilizerFactor = clamp(0.8 + input.fertilizerUsage / 200, 0.7, 1.2);

  const predictedYield =
    baseline * irrigationFactor * soilFactor * rainfallFactor * fertilizerFactor;

  const confidence = clamp(
    0.55 +
      (rainfallFactor > 1 ? 0.08 : -0.05) +
      (input.irrigationType === "drip" ? 0.05 : 0) -
      (input.soilType === "sandy" ? 0.08 : 0),
    0.45,
    0.85
  );

  const rainfallStatus =
    input.rainfall < 70
      ? "Below seasonal average rainfall"
      : input.rainfall > 120
        ? "Above seasonal rainfall"
        : "Seasonal rainfall tracking normal range";

  const temperatureTrend =
    input.cropType === "wheat"
      ? "Cool nights expected through heading stage"
      : "Daytime temperatures trending slightly above seasonal average";

  const riskAlerts: string[] = [];
  if (input.rainfall < 60) {
    riskAlerts.push(
      "Moisture stress risk: rainfall has trailed the seasonal norm. Plan supplemental irrigation."
    );
  }
  if (input.fertilizerUsage < 30) {
    riskAlerts.push(
      "Nutrient deficit risk: fertilizer application is below the recommended range."
    );
  }

  const recommendedPractices: string[] = [
    "Calibrate fertilizer application to crop stage and soil tests.",
    "Walk the field after each irrigation cycle to spot stress early.",
    "Log scouting observations in the SmartYield notebook to refine forecasts."
  ];

  return {
    predictedYield: Number(predictedYield.toFixed(2)),
    unit: "tons_per_hectare",
    confidence,
    baselineYield: baseline,
    historicalYields: [
      { season: "Kharif 2022", yield: Number((baseline * 0.92).toFixed(2)) },
      { season: "Rabi 2023", yield: Number((baseline * 0.97).toFixed(2)) },
      { season: "Kharif 2024", yield: Number((baseline * 1.02).toFixed(2)) }
    ],
    riskAlerts,
    recommendedPractices,
    weatherOutlook: {
      summary: `${rainfallStatus}. Keep monitoring forecasts during the crop's sensitive stages.`,
      rainfallOutlook:
        input.rainfall < 70
          ? "Carry forward moisture conservation practices; forecast suggests intermittent showers."
          : "Rainfall outlook stable with periodic events maintaining soil moisture.",
      temperatureTrend
    }
  };
};

const generateOfflineAdvice = (
  prediction: YieldPrediction,
  input: FarmerInput
): AdviceResponse => {
  const irrigationMessage =
    input.irrigationType === "rainfed"
      ? "Plan supplemental irrigation if rainfall gaps persist."
      : "Inspect emitters and distribution uniformity weekly.";

  return {
    knowledgeBase: [
      {
        title: "Water management next steps",
        summary: `Optimize ${input.irrigationType} scheduling to safeguard yield potential.`,
        actions: [
          irrigationMessage,
          "Log irrigation events in SmartYield to refine recommendations.",
          "Ensure soil moisture stays within optimal range using tensiometers or feel method."
        ],
        category: "water"
      },
      {
        title: "Soil nutrition follow-up",
        summary:
          "Align fertilizer plan with current growth stage and soil test data.",
        actions: [
          "Schedule a quick soil health check if one has not been done this season.",
          "Balance nitrogen with micronutrient sprays during vegetative phase.",
          "Record application dates to correlate with yield outcomes."
        ],
        category: "nutrition"
      },
      {
        title: "Crop scouting checklist",
        summary: `Stay ahead of stresses to preserve the projected ${prediction.predictedYield.toFixed(
          2
        )} t/ha outcome.`,
        actions: [
          "Scout twice weekly focusing on pest hot spots and disease-prone zones.",
          "Capture photos in the mobile app to compare with remote sensing cues.",
          "Escalate anomalies to agronomy advisors for swift intervention."
        ],
        category: "soil"
      }
    ]
  };
};

const extractErrorMessage = async (response: Response) => {
  const rawText = await response.text();

  try {
    const parsed = JSON.parse(rawText);
    if (typeof parsed === "string") {
      return parsed;
    }
    if (parsed?.detail) {
      return parsed.detail;
    }
    if (parsed?.message) {
      return parsed.message;
    }
  } catch {
    // ignore JSON parse failure
  }

  return rawText || `${response.status} ${response.statusText}`;
};

export default function PredictYieldPage() {
  const [farmerInput, setFarmerInput] = useState<FarmerInput>(initialInput);
  const [prediction, setPrediction] = useState<YieldPrediction>();
  const [advice, setAdvice] = useState<AdviceResponse>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const { data: fetchedOptions } = useSWR<ReferenceOptions>(
    `${API_BASE}/api/reference/options`
  );
  const referenceOptions = fetchedOptions ?? DEFAULT_REFERENCE_OPTIONS;

  const onLocationChange = useCallback(
    (location: Pick<FarmerInput, "latitude" | "longitude" | "locationName">) => {
      setFarmerInput((prev) => ({
        ...prev,
        ...location
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (values: FarmerInput) => {
      setSubmitting(true);
      setError(undefined);
      try {
        let normalizedPrediction: YieldPrediction;
        let statusMessage: string | undefined;
        let usedOfflinePrediction = false;

        try {
          const predictionResponse = await fetch(
            `${API_BASE}/api/yield/predict`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(toApiFarmerPayload(values))
            }
          );

          if (!predictionResponse.ok) {
            const message = await extractErrorMessage(predictionResponse);
            throw new Error(message || "Failed to generate prediction");
          }

          const predictionPayload = await predictionResponse.json();
          normalizedPrediction = mapPrediction(predictionPayload);
        } catch (err) {
          console.error("Prediction request failed", err);
          normalizedPrediction = generateOfflinePrediction(values);
          statusMessage =
            "Live prediction service is unreachable. Displaying an offline estimate instead.";
          usedOfflinePrediction = true;
        }

        setPrediction(normalizedPrediction);

        if (usedOfflinePrediction) {
          setAdvice(generateOfflineAdvice(normalizedPrediction, values));
        } else {
          try {
            const adviceResponse = await fetch(`${API_BASE}/api/advice`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                farmer: toApiFarmerPayload(values),
                predicted_yield: normalizedPrediction.predictedYield
              })
            });

            if (!adviceResponse.ok) {
              const message = await extractErrorMessage(adviceResponse);
              throw new Error(message || "Failed to load agronomy advice");
            }

            const advicePayload = await adviceResponse.json();
            setAdvice(mapAdvice(advicePayload));
          } catch (err) {
            console.error("Advice request failed", err);
            setAdvice(generateOfflineAdvice(normalizedPrediction, values));
            statusMessage =
              statusMessage ??
              "Live agronomy advice is unavailable. Showing default recommendations.";
          }
        }

        setError(statusMessage);
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  const headline = useMemo(() => {
    if (!prediction) {
      return "Plan your season with data-driven insights.";
    }
    return `Estimated yield: ${prediction.predictedYield.toFixed(
      2
    )} t/ha · Confidence ${(prediction.confidence * 100).toFixed(0)}%`;
  }, [prediction]);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <section className="space-y-4 rounded-3xl bg-gradient-to-r from-primary to-primary-light p-8 text-white shadow-lg">
        <header className="space-y-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide">
            SmartYield
          </span>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Forecast yield. Boost productivity.
          </h1>
          <p className="text-sm text-white/80 md:text-base">{headline}</p>
        </header>
        <div className="flex flex-wrap gap-3 text-xs text-white/80">
          <span className="rounded-full bg-black/10 px-3 py-1">
            Location-aware predictions
          </span>
          <span className="rounded-full bg-black/10 px-3 py-1">
            Agronomy intelligence
          </span>
          <span className="rounded-full bg-black/10 px-3 py-1">
            Weather + soil signals
          </span>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <LocationSelector value={farmerInput} onChange={onLocationChange} />
          <ParameterForm
            initialValues={farmerInput}
            options={referenceOptions}
            isSubmitting={isSubmitting}
            onSubmit={(values) => {
              setFarmerInput(values);
              void handleSubmit(values);
            }}
          />
        </div>
        <div className="space-y-6">
          <YieldSummary prediction={prediction} isLoading={isSubmitting} />
          <InsightsPanel advice={advice} isLoading={isSubmitting} />
        </div>
      </div>
    </main>
  );
}


