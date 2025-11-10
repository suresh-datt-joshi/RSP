"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserName(data.name);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

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

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="rounded-lg bg-primary/10 px-4 py-2 text-primary transition hover:bg-primary/20"
              >
                {userName || "Profile"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="transition hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
