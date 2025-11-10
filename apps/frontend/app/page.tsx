import Link from "next/link";

const features = [
  {
    title: "Predict with confidence",
    description:
      "Blend satellite imagery, weather, and soil insights to forecast yields tailored to each field."
  },
  {
    title: "Act on agronomy advice",
    description:
      "Get AI-generated guidance on irrigation, fertilizer usage, and best practices for your crops."
  },
  {
    title: "Monitor from anywhere",
    description:
      "Track performance across regions, compare seasons, and spot emerging risks early."
  }
];

const stats = [
  { value: "10+", label: "Regions pre-configured" },
  { value: "5 min", label: "Average model response" },
  { value: "95%", label: "Historical accuracy benchmark" }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="grid items-center gap-10 rounded-3xl bg-gradient-to-r from-primary to-primary-light px-8 py-16 text-white shadow-lg md:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em]">
            SmartYield Platform
          </span>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Precision agriculture intelligence built for agronomists and grower
            networks.
          </h1>
          <p className="text-base text-white/80">
            Discover a single pane of glass for seasonal planning, field
            monitoring, and data-backed recommendations. Bring certainty to the
            decisions that matter most.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/predict-yield"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              Launch Predict Yield
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </div>
        <div className="space-y-6 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="text-lg font-medium text-white/90">
            Why agribusiness teams choose SmartYield
          </h2>
          <ul className="space-y-4 text-sm text-white/80">
            <li>
              • Dynamic risk scoring across your portfolio of growers and
              regions.
            </li>
            <li>
              • Scenario planning that blends weather forecasts with historical
              yields.
            </li>
            <li>
              • Collaboration workspace for advisors, agronomists, and growers.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-16 grid gap-6 rounded-3xl border border-border bg-white p-10 shadow-sm md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <p className="text-3xl font-semibold text-primary">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 space-y-8">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Everything you need in one platform
          </h2>
          <p className="text-sm text-muted-foreground">
            Pair the field intelligence module with tailored recommendations to
            manage inputs, water, and risk.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Ready to pilot SmartYield with your growers?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Launch the prediction workspace to estimate yield and unlock proactive
          agronomy guidance.
        </p>
        <Link
          href="/predict-yield"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Start predicting now
        </Link>
      </section>
    </main>
  );
}


