export type TimeUnit = "minutes" | "hours" | "days";

export interface Duration {
  value: number;
  unit: TimeUnit;
}

export function calculateExactMinutes(duration: Duration): number {
  switch (duration.unit) {
    case "minutes":
      return duration.value;
    case "hours":
      return duration.value * 60;
    case "days":
      return duration.value * 24 * 60;
    default:
      return duration.value;
  }
}

export function formatDuration(duration: Duration): string {
  return `${duration.value} ${duration.unit}`;
}
