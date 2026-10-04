export const GITHUB_REPO = "VaradDurge/ARGUS";
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

export function formatStarCount(count: number): string {
  if (count < 1000) return String(count);
  if (count < 10_000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${Math.round(count / 1000)}k`;
}
