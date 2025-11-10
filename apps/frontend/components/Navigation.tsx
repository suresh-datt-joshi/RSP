"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-primary transition hover:text-primary/80"
        >
          SmartYield
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">
            Home
          </Link>
          <Link
            href="/predict-yield"
            className="transition hover:text-foreground"
          >
            Predict Yield
          </Link>
          <Link href="/about" className="transition hover:text-foreground">
            About
          </Link>
          <Link
            href="/profile"
            className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary/90"
          >
            {isAuthenticated && user ? user.name : "Profile"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
