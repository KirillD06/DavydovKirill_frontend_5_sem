import { useState } from "react";

export const DEFAULT_IMAGE = "/default.svg";
export const DEFAULT_VIDEO = "/default.mp4";

export function SoilImage({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      className={className}
      src={failed || !src ? DEFAULT_IMAGE : src}
      alt={name}
      onError={() => setFailed(true)}
    />
  );
}
