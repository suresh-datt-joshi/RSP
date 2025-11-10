"use client";

import axios from "axios";
import { ReactNode } from "react";
import { SWRConfig } from "swr";

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export default function Providers({ children }: { children: ReactNode }) {
  return (
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
  );
}

