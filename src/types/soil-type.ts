export interface SoilType {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  looseningFactor: number | null;
  density: number | null;
  likesCount: number;
  isLiked: 0 | 1;
  isMine: 0 | 1;
}

export function formatSoilNumber(value: number | null, unit = "") {
  return value === null ? "—" : value.toFixed(2).replace(".", ",") + unit;
}
