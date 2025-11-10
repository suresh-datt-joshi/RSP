"use client";

import { useState } from "react";
import Link from "next/link";

const phases = [
  {
    id: 1,
    title: "Phase 1",
    subtitle: "The Beginning of the Journey",
    icon: "🌱",
    content: (
      <div className="space-y-4 text-muted-foreground">
        <h3 className="text-2xl font-semibold text-foreground">
          🌱 Phase 1 — The Beginning of the Journey
        </h3>
        <p>
          Our project started with a simple question:
          <br />
          <em>&ldquo;Can we predict crop yield using the history we already have?&rdquo;</em>
        </p>
        <p>So in Phase 1, we became data detectives.</p>
        <p>
          We travelled through 60 years of agricultural history — from 1961 to 2021 — collecting facts about:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>how much crops were grown,</li>
          <li>how temperatures changed,</li>
          <li>how much fertilizer was used,</li>
          <li>how land was used,</li>
          <li>how rainfall shifted,</li>
          <li>and how pesticides were applied.</li>
        </ul>
        <p>It felt like assembling a giant agricultural time machine.</p>
        <p>
          But old records are messy. Some years had missing values, some countries had incomplete reports.
          So we cleaned the data, filled the gaps, aligned timelines, and scaled everything so the models could understand it.
        </p>
        <p>
          Then came the first set of models — the &ldquo;classic thinkers&rdquo; like ARIMA.
          They analyzed past yield like a traditional forecaster reading old records.
          They did well, but we wanted more.
        </p>
        <p>
          So we built something smarter — a multivariate LSTM, a deep learning model that can remember patterns from several years back.
          It learned how temperature affects yield, how rainfall shifts create changes, and how fertilizer boosts production.
        </p>
        <p>And the results were stunning.</p>
        <p>
          The LSTM became incredibly accurate, reaching an RMSE as low as 0.001565, proving that understanding history deeply can predict the future beautifully.
        </p>
        <p className="font-semibold text-foreground">
          Phase 1 ended with a powerful insight:
          <br />
          If you give the past a voice, it can tell you the future.
        </p>
      </div>
    )
  },
  {
    id: 2,
    title: "Phase 2",
    subtitle: "Seeing Earth from Space",
    icon: "🛰️",
    content: (
      <div className="space-y-4 text-muted-foreground">
        <h3 className="text-2xl font-semibold text-foreground">
          🛰️ Phase 2 — Seeing Earth from Space
        </h3>
        <p>But we weren&apos;t satisfied.</p>
        <p>
          We wanted something bigger, something that could look at the earth itself — not just numbers in a table.
          So in Phase 2, we moved from spreadsheets to space.
          Literally.
        </p>
        <p>
          We tapped into Google Earth Engine, a platform that holds decades of satellite images.
        </p>
        <p>Imagine opening a window where you could watch:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>crop fields turning green and brown over seasons</li>
          <li>land temperatures rising and falling</li>
          <li>clouds pouring rain or blocking the sun</li>
          <li>vegetation changing color through multispectral images</li>
        </ul>
        <p>This is what MODIS data gave us.</p>
        <p>We downloaded:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>surface reflectance images,</li>
          <li>land surface temperature,</li>
          <li>land cover masks,</li>
          <li>and even daily weather grids.</li>
        </ul>
        <p>
          Then we clipped these images to specific counties, masked out non-agricultural land, stacked hundreds of temporal layers together, and shaped them into 64×64 pixel time-sequence cubes.
        </p>
        <p>Now we needed a model that could see space and time together.</p>
        <p>So we built the CNN-LSTM hybrid.</p>
        <p>The CNN looked at each satellite image like eyes scanning a photograph.</p>
        <p>The LSTM understood how these images change through months and seasons.</p>
        <p>Together, they became a powerful system that could literally see crop health from the sky.</p>
        <p>
          The model performed well across different years — even detecting tough conditions like the 2012 drought.
        </p>
        <p className="font-semibold text-foreground">
          Phase 2 ended with another insight:
          <br />
          When machines learn to see the Earth, predictions become smarter, richer, and more realistic.
        </p>
      </div>
    )
  }
];

export default function OurStoryPage() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 space-y-12">
      <section className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Our Story
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
          The Journey Behind SmartYield
        </h1>
        <p className="text-base text-muted-foreground md:text-lg max-w-3xl mx-auto">
          From historical data to satellite imagery, discover how we built a platform
          that combines the past and the present to predict the future of agriculture.
        </p>
      </section>

      {selectedPhase === null ? (
        <section className="grid gap-6 md:grid-cols-2">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className="text-left space-y-4 rounded-2xl border-2 border-border bg-white p-8 shadow-sm transition hover:border-primary hover:shadow-md"
            >
              <div className="text-5xl">{phase.icon}</div>
              <h2 className="text-2xl font-semibold text-foreground">
                {phase.title}
              </h2>
              <p className="text-muted-foreground">{phase.subtitle}</p>
              <div className="text-primary font-semibold text-sm">
                Click to read more →
              </div>
            </button>
          ))}
        </section>
      ) : (
        <section className="space-y-6">
          <button
            onClick={() => setSelectedPhase(null)}
            className="text-primary hover:text-primary/80 font-semibold text-sm transition flex items-center gap-2"
          >
            ← Back to phases
          </button>
          <article className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            {phases.find((p) => p.id === selectedPhase)?.content}
          </article>
        </section>
      )}

      {selectedPhase === null && (
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Ready to experience the technology?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Try our yield prediction platform and see how decades of research
            translate into actionable insights for your farm.
          </p>
          <Link
            href="/predict-yield"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Launch Predict Yield
          </Link>
        </section>
      )}
    </main>
  );
}
