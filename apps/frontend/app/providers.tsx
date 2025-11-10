"use client";

import axios from "axios";
import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { AuthProvider } from "@/lib/auth-context";

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          onError: (error) => {
            console.error("SWR fetch error", error);
          }
        }}
      >
        {children}
      </SWRConfig>
    </AuthProvider>
  );
}

