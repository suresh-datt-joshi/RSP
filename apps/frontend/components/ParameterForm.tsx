"use client";

import { FarmerInput, ReferenceOptions } from "@/types";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { useEffect } from "react";

interface ParameterFormProps {
  initialValues: FarmerInput;
  options: ReferenceOptions | undefined;
  isSubmitting: boolean;
  onSubmit: (values: FarmerInput) => void;
}

const fieldClass =
  "mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export default function ParameterForm({
  initialValues,
  options,
  isSubmitting,
  onSubmit
}: ParameterFormProps) {
  const form = useForm<FarmerInput>({
    defaultValues: initialValues
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  return (
    <form
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-primary-dark">
          Field Parameters
        </h2>
        <p className="text-sm text-gray-600">
          Provide the latest field information to personalise the yield
          estimate.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-gray-700">
          Crop
          <Controller
            name="cropType"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <select {...field} className={fieldClass}>
                <option value="">Select crop</option>
                {options?.crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} · {crop.duration}
                  </option>
                ))}
              </select>
            )}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Soil Type
          <Controller
            name="soilType"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <select {...field} className={fieldClass}>
                <option value="">Select soil</option>
                {options?.soils.map((soil) => (
                  <option key={soil.id} value={soil.id}>
                    {soil.name} · {soil.suitability}
                  </option>
                ))}
              </select>
            )}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Irrigation Method
          <Controller
            name="irrigationType"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <select {...field} className={fieldClass}>
                <option value="">Select irrigation type</option>
                {options?.irrigation.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name} · {method.waterUse}
                  </option>
                ))}
              </select>
            )}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Field Size (hectares)
          <Controller
            name="acreage"
            control={form.control}
            rules={{ required: true, min: 0.1 }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={0}
                step="0.1"
                className={fieldClass}
                placeholder="e.g. 2.5"
              />
            )}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Rainfall (mm in last 30 days)
          <Controller
            name="rainfall"
            control={form.control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={0}
                step="1"
                className={fieldClass}
                placeholder="e.g. 120"
              />
            )}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Fertilizer Applied (kg/ha)
          <Controller
            name="fertilizerUsage"
            control={form.control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min={0}
                step="1"
                className={fieldClass}
                placeholder="e.g. 50"
              />
            )}
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Sowing Date
          <Controller
            name="sowingDate"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <input {...field} type="date" className={fieldClass} />
            )}
          />
        </label>
      </div>

      <button
        type="submit"
        className={classNames(
          "inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          { "opacity-75": isSubmitting }
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Calculating…" : "Predict Yield"}
      </button>
    </form>
  );
}

