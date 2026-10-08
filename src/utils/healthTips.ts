import { HealthTip } from "@/types/healthTip";

export const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .trim();
};

export const isTipActiveToday = (tip: HealthTip) => {
  const today = new Date();
  const from = new Date(`${tip.from}T00:00:00`);
  const to = new Date(`${tip.to}T23:59:59`);

  return tip.active === "1" && today >= from && today <= to;
};

export const sortTipsNewestFirst = (tips: HealthTip[]) => {
  return [...tips].sort((a, b) => b.id - a.id);
};

export const getCurrentHealthTip = (tips: HealthTip[]) => {
  return sortTipsNewestFirst(tips).find(isTipActiveToday) ?? null;
};