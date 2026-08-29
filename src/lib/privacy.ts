export const ANALYTICS_CONSENT_KEY = "myfreepdfeditor_analytics_consent";

export type AnalyticsConsent = "granted" | "denied";

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : null;
}

export function setAnalyticsConsent(value: AnalyticsConsent) {
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("analytics-consent-changed", { detail: value }));
}

export function clearAnalyticsConsent() {
  window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  window.dispatchEvent(new CustomEvent("analytics-consent-changed", { detail: null }));
}
