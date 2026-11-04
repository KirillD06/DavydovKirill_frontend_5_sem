import { useState } from "react";
import { DEFAULT_IMAGE, DEFAULT_VIDEO, SoilImage } from "./SoilImage";
import type { SoilType } from "../types/soil-type";

export function SoilVideo({ soil }: { soil: SoilType }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <SoilImage src={soil.imageUrl} name={soil.name} className="soil-video" />
    );
  return (
    <video
      className="soil-video"
      src={soil.videoUrl || DEFAULT_VIDEO}
      poster={soil.imageUrl || DEFAULT_IMAGE}
      aria-label={`Разработка грунта: ${soil.name}`}
      autoPlay
      loop
      muted
      playsInline
      controls
      preload="metadata"
      onError={() => setFailed(true)}
    />
  );
}
