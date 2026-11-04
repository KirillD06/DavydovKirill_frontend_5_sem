export interface SoilType {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  looseningFactor: number;
  density: number;
  likesCount: number;
  isLiked: 0 | 1;
  isMine: 0 | 1;
}
