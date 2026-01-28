import { headers } from "next/headers";

export function getCurrentTimeMs() {
  const testMode = process.env.TEST_MODE === "1";
  const h = headers();
  if (testMode) {
    const t = h.get("x-test-now-ms");
    if (t) return Number(t);
  }
  return Date.now();
}
