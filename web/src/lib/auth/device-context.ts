export type DeviceRegistrationPayload = {
  device_fingerprint: string;
  device_name?: string;
};

function safeRandomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `fp-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getOsLabel(ua: string): string {
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Appareil";
}

function getBrowserLabel(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  if (/firefox\//i.test(ua)) return "Firefox";
  return "Navigateur";
}

function getDeviceName(): string {
  if (typeof navigator === "undefined") return "Navigateur web";
  const ua = navigator.userAgent || "";
  const os = getOsLabel(ua);
  const browser = getBrowserLabel(ua);
  const mobileHint =
    "userAgentData" in navigator &&
    !!(navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile;
  return `${os}${mobileHint ? " Mobile" : ""} - ${browser}`;
}

export function getDeviceRegistrationPayload(scope: "user" | "enterprise"): DeviceRegistrationPayload {
  if (typeof window === "undefined") {
    return { device_fingerprint: `${scope}-server`, device_name: "Navigateur web" };
  }
  const storageKey = `otp_hora_${scope}_device_fingerprint`;
  let fingerprint = window.localStorage.getItem(storageKey);
  if (!fingerprint) {
    fingerprint = `${scope}-${safeRandomId()}`;
    window.localStorage.setItem(storageKey, fingerprint);
  }
  return {
    device_fingerprint: fingerprint,
    device_name: getDeviceName(),
  };
}

