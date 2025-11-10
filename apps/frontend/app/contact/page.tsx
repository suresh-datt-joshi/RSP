const teamMembers = [
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

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 space-y-12">
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
          Contact Us
        </h1>
        <p className="text-base text-muted-foreground md:text-lg max-w-2xl mx-auto">
          Have questions or want to collaborate? Reach out to any of our team members.
        </p>
      </section>

      <section>
        <div className="grid gap-6 md:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.email}
              className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-foreground">
                {member.name}
              </h3>
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-base text-primary hover:underline"
              >
                <span>✉️</span>
                <span>{member.email}</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
