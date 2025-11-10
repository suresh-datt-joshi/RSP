import Link from "next/link";

const values = [
  {
    title: "Farmer-first intelligence",
    description:
      "We build with agronomists and growers to make complex data actionable on the ground."
  },
  {
    title: "Responsible AI",
    description:
      "Models are explainable, auditable, and tuned with agronomic experts to maintain trust."
  },
  {
    title: "Open collaboration",
    description:
      "APIs and integrations let you plug SmartYield into existing farm management systems."
  }
];

const milestones = [
  {
    caption: "2019",
    title: "Research origins",
    description:
      "Launched as a university research initiative exploring satellite-informed yield modeling."
  },
  {
    caption: "2021",
    title: "Pilot deployments",
    description:
      "Partnered with cooperatives across India to validate models against on-field trials."
  },
  {
    caption: "2024",
    title: "SmartYield Platform",
    description:
      "Released the unified platform powering advisory teams, farmer networks, and agri-input providers."
  }
];

const teamMembers = [
  {
    name: "Khallikkunaisa",
    email: "khallikkunaisa.cs@hkbk.edu.in"
  },
  {
    name: "Suresh Datt Joshi",
    email: "sureshdj9632@gmail.com"
  },
  {
    name: "V Tilak Teja",
    email: "1hk22cs182@hkbk.edu.in"
  },
  {
    name: "Swaran Raj E S",
    email: "swaranraj733@gmail.com"
  },
  {
    name: "Tharun R",
    email: "1hk22cs179@hkbk.edu.in"
  }
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 space-y-16">
      <section className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          About SmartYield
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
          Building resilient food systems through predictive agronomy.
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          SmartYield helps agronomists, input providers, and cooperatives align
          around trusted predictions. We blend satellite data, historical
          records, and hyperlocal weather to deliver forecasts and advice that
          drive better outcomes at scale.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <article
            key={value.title}
            className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {value.title}
            </h2>
            <p className="text-sm text-muted-foreground">{value.description}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Where we&apos;re headed
        </h2>
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.title}
              className="grid gap-3 rounded-2xl border border-border bg-white p-6 shadow-sm md:grid-cols-[100px_auto]"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                {milestone.caption}
              </span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {milestone.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Meet the Team
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.email}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-2"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {member.name}
              </h3>
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <span>✉️</span>
                <span>{member.email}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          Interested in collaborating or piloting SmartYield?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Our team partners with agritech startups, cooperatives, and research
          institutions to build the future of digital agronomy.
        </p>
        <Link
          href="/predict-yield"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Explore the platform
        </Link>
      </section>
    </main>
  );
}


