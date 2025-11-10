"use client";

import dynamic from "next/dynamic";
import { FarmerInput } from "@/types";

interface LocationSelectorProps {
  value: Pick<FarmerInput, "latitude" | "longitude" | "locationName">;
  onChange: (
    value: Pick<FarmerInput, "latitude" | "longitude" | "locationName">
  ) => void;
}

const DynamicMap = dynamic(() => import("./LocationSelectorMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-600">
      Loading interactive map…
    </div>
  )
});

export default function LocationSelector({
  value,
  onChange
}: LocationSelectorProps) {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-xl font-semibold text-primary-dark">
          Choose Field Location
        </h2>
        <p className="text-sm text-gray-600">
          Tap on the map to pin your field. You can refine the village or farm
          name below.
        </p>
      </header>

      <div className="h-80 overflow-hidden rounded-2xl">
        <DynamicMap
          latitude={value.latitude}
          longitude={value.longitude}
          onSelect={(lat, lon) =>
            onChange({
              latitude: lat,
              longitude: lon,
              locationName: value.locationName || ""
            })
          }
        />
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Village / Farm Name
        <input
          type="text"
          value={value.locationName}
          onChange={(event) =>
            onChange({
              latitude: value.latitude,
              longitude: value.longitude,
              locationName: event.target.value
            })
          }
          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="E.g., Kharadi Farm, Punjab"
        />
      </label>
    </section>
  );
}

