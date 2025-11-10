import { AdviceResponse } from "@/types";

interface InsightsPanelProps {
  advice?: AdviceResponse;
  isLoading: boolean;
}

export default function InsightsPanel({
  advice,
  isLoading
}: InsightsPanelProps) {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-xl font-semibold text-primary-dark">
          Yield Boosters
        </h2>
        <p className="text-sm text-gray-600">
          Tailored practices and knowledge-base entries to enhance your yield.
        </p>
      </header>

      {isLoading && (
        <p className="text-sm text-gray-500">
          Gathering agronomy guidance and best practices…
        </p>
      )}

      {!isLoading && advice && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {advice.knowledgeBase.map((item) => (
            <article
              key={item.title}
              className="flex h-full flex-col rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <span className="text-xs uppercase tracking-wide text-primary">
                {item.category}
              </span>
              <h3 className="mt-2 text-base font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="mt-1 flex-1 text-sm text-gray-600">
                {item.summary}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {item.actions.map((action) => (
                  <li key={action} className="rounded-lg bg-white px-3 py-2">
                    • {action}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {!isLoading && !advice && (
        <p className="text-sm text-gray-500">
          Run a prediction to unlock tailored advice.
        </p>
      )}
    </section>
  );
}

