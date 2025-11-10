import { YieldPrediction } from "@/types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface YieldSummaryProps {
  prediction?: YieldPrediction;
  isLoading: boolean;
}

export default function YieldSummary({
  prediction,
  isLoading
}: YieldSummaryProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-primary-dark">
          Yield Forecast
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Crunching numbers from soil, weather, and historical baselines…
        </p>
      </section>
    );
  }

  if (!prediction || typeof prediction.predictedYield !== 'number') {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-primary-dark">
          Yield Forecast
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Submit field details to generate the yield projection and actionable
          recommendations.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-xl font-semibold text-primary-dark">
          Projected Yield
        </h2>
        <p className="text-sm text-gray-600">
          Includes baseline comparison, confidence band, and near-term weather
          signals.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-primary text-white p-4">
          <span className="text-xs uppercase tracking-wide text-primary-light">
            Predicted Yield
          </span>
          <p className="mt-2 text-3xl font-semibold">
            {prediction.predictedYield?.toFixed(2) || '0.00'} t/ha
          </p>
          <p className="text-xs text-primary-light">
            Confidence: {((prediction.confidence || 0) * 100).toFixed(0)}%
          </p>
        </div>
        <div className="rounded-xl bg-gray-100 p-4">
          <span className="text-xs uppercase tracking-wide text-gray-500">
            Baseline
          </span>
          <p className="mt-2 text-2xl font-semibold text-gray-800">
            {prediction.baselineYield?.toFixed(2) || '0.00'} t/ha
          </p>
          <p className="text-xs text-gray-500">
            Comparison with last 5-year district average
          </p>
        </div>
        <div className="rounded-xl bg-accent/10 p-4 text-accent">
          <span className="text-xs uppercase tracking-wide">
            Weather Outlook
          </span>
          <p className="mt-2 text-base font-medium">
            {prediction.weatherOutlook?.summary || 'N/A'}
          </p>
          <p className="text-xs text-accent/80">
            Rainfall: {prediction.weatherOutlook?.rainfallOutlook || 'N/A'}
          </p>
          <p className="text-xs text-accent/80">
            Temperature: {prediction.weatherOutlook?.temperatureTrend || 'N/A'}
          </p>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer>
          <AreaChart data={prediction.historicalYields}>
            <defs>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E7F5C" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1E7F5C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="season" stroke="#6B7280" />
            <YAxis
              stroke="#6B7280"
              label={{
                value: "Yield (t/ha)",
                angle: -90,
                position: "insideLeft"
              }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} t/ha`, "Yield"]}
            />
            <Area
              type="monotone"
              dataKey="yield"
              stroke="#1E7F5C"
              fillOpacity={1}
              fill="url(#yieldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {prediction.riskAlerts.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-700">Risk Alerts</h3>
          <ul className="mt-2 space-y-1 text-sm text-red-600">
            {prediction.riskAlerts.map((alert) => (
              <li key={alert}>• {alert}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-primary-dark">
          Agronomy Focus
        </h3>
        <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-700 md:grid-cols-2">
          {prediction.recommendedPractices.map((practice) => (
            <li
              key={practice}
              className="rounded-lg border border-green-100 bg-green-50 px-3 py-2"
            >
              {practice}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

