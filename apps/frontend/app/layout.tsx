import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartYield Platform",
  description:
    "Predict crop yields and discover agronomic insights tailored to your field."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-border bg-white/80 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link
                  href="/"
                  className="text-lg font-semibold text-primary transition hover:text-primary/80"
                >
                  SmartYield
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                  <Link
                    href="/"
                    className="transition hover:text-foreground"
                  >
                    Home
                  </Link>
                  <Link
                    href="/predict-yield"
                    className="transition hover:text-foreground"
                  >
                    Predict Yield
                  </Link>
                  <Link
                    href="/about"
                    className="transition hover:text-foreground"
                  >
                    About
                  </Link>
                </nav>
              </div>
            </header>
            <div className="flex-1">{children}</div>
            <footer className="border-t border-border bg-white/80">
              <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} SmartYield. All rights reserved.</p>
                <div className="flex gap-4">
                  <Link href="/about" className="transition hover:text-foreground">
                    Our story
                  </Link>
                  <Link
                    href="/contact"
                    className="transition hover:text-foreground"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

