"use client";

import { useMemo, useState } from "react";
import { z } from "zod";

const optionalNumber = (
  min: number,
  max: number,
  label: "Latitude" | "Longitude"
) =>
  z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim() === "") return undefined;
      if (typeof value === "string") return Number(value);
      return value;
    },
    z
      .number({
        invalid_type_error: `${label} must be a number`
      })
      .min(min, `${label} must be ≥ ${min}`)
      .max(max, `${label} must be ≤ ${max}`)
      .optional()
  );

const formSchema = z.object({
  dateISO: z.string().min(1, "Date is required"),
  timeHHMM: z.string().optional(),
  latitude: optionalNumber(-90, 90, "Latitude"),
  longitude: optionalNumber(-180, 180, "Longitude")
});

export type RitualInput = z.infer<typeof formSchema> & {
  timezoneOffsetMinutes?: number;
};

type Props = {
  onSubmit: (input: RitualInput) => void;
  disabled?: boolean;
};

export default function InputRitualForm({ onSubmit, disabled }: Props) {
  const [dateISO, setDateISO] = useState("");
  const [timeHHMM, setTimeHHMM] = useState("12:00");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const timezoneOffsetMinutes = useMemo(
    () => new Date().getTimezoneOffset(),
    []
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = formSchema.safeParse({
      dateISO,
      timeHHMM,
      latitude,
      longitude
    });

    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setErrors([]);
    onSubmit({
      dateISO: result.data.dateISO,
      timeHHMM: result.data.timeHHMM,
      latitude: result.data.latitude,
      longitude: result.data.longitude,
      timezoneOffsetMinutes
    });
  };

  return (
    <form className="ritual-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">Date of birth</label>
        <input
          id="date"
          type="date"
          value={dateISO}
          onChange={(event) => setDateISO(event.target.value)}
          required
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="time">Time of birth</label>
        <input
          id="time"
          type="time"
          value={timeHHMM}
          onChange={(event) => setTimeHHMM(event.target.value)}
          disabled={disabled}
        />
        <p className="helper">Noon fallback if unknown.</p>
      </div>
      <div className="grid-two">
        <div>
          <label htmlFor="lat">Latitude</label>
          <input
            id="lat"
            type="text"
            placeholder="e.g. 40.71"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            disabled={disabled}
          />
          <p className="helper">Optional for rising sign and houses.</p>
        </div>
        <div>
          <label htmlFor="lon">Longitude</label>
          <input
            id="lon"
            type="text"
            placeholder="e.g. -74.00"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            disabled={disabled}
          />
          <p className="helper">Optional, leave blank if unknown.</p>
        </div>
      </div>
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <button type="submit" disabled={disabled}>
        Cast the Chart
      </button>
    </form>
  );
}
