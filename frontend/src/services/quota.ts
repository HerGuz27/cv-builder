const QUOTA_KEY = "ats_quota";

export const FREE_MONTHLY_LIMIT = 3;

interface Quota {
  period: string; // "2026-08"
  used: number;
}

function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function read(): Quota {
  const stored = localStorage.getItem(QUOTA_KEY);
  const period = currentPeriod();

  if (!stored) return { period, used: 0 };

  try {
    const parsed = JSON.parse(stored) as Quota;
    // Reset on new month
    if (parsed.period !== period) return { period, used: 0 };
    return parsed;
  } catch {
    return { period, used: 0 };
  }
}

export function getRemaining(): number {
  return Math.max(0, FREE_MONTHLY_LIMIT - read().used);
}

export function hasQuota(): boolean {
  return getRemaining() > 0;
}

export function consume(): void {
  const quota = read();
  quota.used += 1;
  localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
}
