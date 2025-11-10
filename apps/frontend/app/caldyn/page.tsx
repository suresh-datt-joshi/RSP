"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";

const LocationSelectorMap = dynamic(
  () => import("@/components/LocationSelectorMap"),
  { ssr: false }
);

interface WeatherAlert {
  date: string;
  alert_type: string;
  severity: string;
  description: string;
  recommendations: string[];
}

interface CropStage {
  stage_name: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  description: string;
  care_activities: string[];
  irrigation_frequency: string;
  fertilizer_recommendations: string[];
  weather_considerations: string;
  risk_factors: string[];
}

interface CropLifecycle {
  crop_type: string;
  crop_name: string;
  planting_date: string;
  harvest_date: string;
  total_duration_days: number;
  current_stage: string;
  current_day: number;
  location: string;
  stages: CropStage[];
  weather_alerts: WeatherAlert[];
  irrigation_schedule: Array<{
    stage: string;
    period: string;
    frequency: string;
    is_critical: boolean;
  }>;
  fertilizer_schedule: Array<{
    date: string;
    stage: string;
    fertilizer: string;
    timing: string;
  }>;
  general_care_tips: string[];
  harvest_readiness_indicators: string[];
}

const CROPS = [
  { id: "wheat", name: "Wheat", duration: "120-150 days" },
  { id: "rice", name: "Rice", duration: "110-135 days" },
  { id: "maize", name: "Maize", duration: "90-110 days" },
  { id: "cotton", name: "Cotton", duration: "150-180 days" },
  { id: "soybean", name: "Soybean", duration: "90-110 days" },
  { id: "sugarcane", name: "Sugarcane", duration: "270-365 days" }
];

function CalDynContent() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    cropType: "",
    plantingDate: "",
    latitude: 0,
    longitude: 0,
    locationName: "",
    acreage: ""
  });
  const [lifecycle, setLifecycle] = useState<CropLifecycle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      locationName: name
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/crop-lifecycle/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          crop_type: formData.cropType,
          planting_date: formData.plantingDate,
          latitude: formData.latitude,
          longitude: formData.longitude,
          location_name: formData.locationName,
          acreage: parseFloat(formData.acreage)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate crop lifecycle calendar");
      }

      const data = await response.json();
      setLifecycle(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getProgress = (lifecycle: CropLifecycle) => {
    return Math.min(100, Math.round((lifecycle.current_day / lifecycle.total_duration_days) * 100));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-800">CalDyn</h1>
          <p className="mt-2 text-lg text-gray-600">Calendar Dynamic - Your Crop Lifecycle Companion</p>
          <p className="mt-1 text-sm text-gray-500">
            Get personalized care schedules with weather-based recommendations
          </p>
        </div>

        {!lifecycle ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Create Your Crop Calendar
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Crop *
                </label>
                <select
                  required
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a crop...</option>
                  {CROPS.map((crop) => (
                    <option key={crop.id} value={crop.id}>
                      {crop.name} ({crop.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Planting Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Farm Area (acres) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  required
                  value={formData.acreage}
                  onChange={(e) => setFormData({ ...formData, acreage: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter farm area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Location *
                </label>
                <LocationSelectorMap onLocationSelect={handleLocationSelect} />
                {formData.locationName && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {formData.locationName}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.locationName}
                className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Generating Calendar..." : "Generate Crop Calendar"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg">
              <div>
                <h2 className="text-3xl font-bold">{lifecycle.crop_name}</h2>
                <p className="mt-1 text-green-100">{lifecycle.location}</p>
                <p className="mt-2 text-sm">
                  Planted: {formatDate(lifecycle.planting_date)} • Harvest: {formatDate(lifecycle.harvest_date)}
                </p>
              </div>
              <button
                onClick={() => setLifecycle(null)}
                className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/30"
              >
                New Calendar
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-800">Current Progress</h3>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Day {lifecycle.current_day} of {lifecycle.total_duration_days}</span>
                    <span>{getProgress(lifecycle)}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all"
                      style={{ width: `${getProgress(lifecycle)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-lg font-medium text-green-700">
                    Current Stage: {lifecycle.current_stage}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-800">Quick Stats</h3>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Total Duration</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{lifecycle.total_duration_days} days</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Growth Stages</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{lifecycle.stages.length} stages</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Days Remaining</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {Math.max(0, lifecycle.total_duration_days - lifecycle.current_day)} days
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Weather Alerts</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{lifecycle.weather_alerts.length} active</dd>
                  </div>
                </dl>
              </div>
            </div>

            {lifecycle.weather_alerts.length > 0 && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow">
                <h3 className="text-xl font-semibold text-orange-900">Weather Alerts</h3>
                <div className="mt-4 space-y-3">
                  {lifecycle.weather_alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-4 ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{alert.alert_type}</h4>
                          <p className="mt-1 text-sm">{alert.description}</p>
                          <p className="mt-1 text-xs opacity-75">{formatDate(alert.date)}</p>
                        </div>
                        <span className="rounded-full px-3 py-1 text-xs font-semibold">
                          {alert.severity}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm">
                        {alert.recommendations.map((rec, ridx) => (
                          <li key={ridx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
              <h3 className="text-xl font-semibold text-gray-800">Crop Growth Stages</h3>
              <div className="mt-6 space-y-4">
                {lifecycle.stages.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg border-2 p-5 transition-all ${
                      stage.stage_name === lifecycle.current_stage
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <div
                      className="flex cursor-pointer items-center justify-between"
                      onClick={() => setActiveStage(activeStage === idx ? null : idx)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{stage.stage_name}</h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(stage.start_date)} - {formatDate(stage.end_date)} ({stage.duration_days} days)
                            </p>
                          </div>
                        </div>
                      </div>
                      <svg
                        className={`h-5 w-5 text-gray-400 transition-transform ${activeStage === idx ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {activeStage === idx && (
                      <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                        <div>
                          <p className="text-sm text-gray-700">{stage.description}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900">💧 Irrigation</h5>
                          <p className="mt-1 text-sm text-gray-700">{stage.irrigation_frequency}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900">🌱 Care Activities</h5>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {stage.care_activities.map((activity, aidx) => (
                              <li key={aidx} className="flex items-start">
                                <span className="mr-2 text-green-600">✓</span>
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900">🌾 Fertilizers</h5>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {stage.fertilizer_recommendations.map((fert, fidx) => (
                              <li key={fidx} className="flex items-start">
                                <span className="mr-2 text-green-600">•</span>
                                <span>{fert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900">🌤️ Weather Considerations</h5>
                          <p className="mt-1 text-sm text-gray-700">{stage.weather_considerations}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900">⚠️ Risk Factors</h5>
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {stage.risk_factors.map((risk, ridx) => (
                              <li key={ridx} className="flex items-start">
                                <span className="mr-2 text-amber-600">⚠</span>
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-800">💧 Irrigation Schedule</h3>
                <div className="mt-4 space-y-3">
                  {lifecycle.irrigation_schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-3 ${item.is_critical ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.stage}</p>
                          <p className="text-sm text-gray-600">{item.period}</p>
                        </div>
                        {item.is_critical && (
                          <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{item.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-800">🌾 Fertilizer Schedule</h3>
                <div className="mt-4 space-y-3">
                  {lifecycle.fertilizer_schedule.map((item, idx) => (
                    <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.stage}</p>
                          <p className="mt-1 text-sm text-gray-700">{item.fertilizer}</p>
                        </div>
                        <span className="text-xs text-gray-500">{item.timing}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{formatDate(item.date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-800">📋 General Care Tips</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {lifecycle.general_care_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-green-600">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-gray-800">🌾 Harvest Readiness Indicators</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {lifecycle.harvest_readiness_indicators.map((indicator, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-amber-600">🌾</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CalDynPage() {
  return (
    <ProtectedRoute>
      <CalDynContent />
    </ProtectedRoute>
  );
}
