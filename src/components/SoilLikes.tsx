import type { SoilType } from "../types/soil-type";
import { useAppDispatch, useAppSelector } from "../store";
import { likeSoilType } from "../store/soilTypesThunks";
import { Icon } from "./Icon";

export function SoilLikes({ soil, busy }: { soil: SoilType; busy: boolean }) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  if (!user) {
    return (
      <span className="soil-likes">
        <Icon name="heart" />
        <span className="visually-hidden">Лайков: </span>
        {soil.likesCount}
      </span>
    );
  }
  return (
    <button
      type="button"
      className="soil-likes soil-like-button"
      aria-label="Лайк"
      aria-pressed={soil.isLiked === 1}
      disabled={busy}
      onClick={() => void dispatch(likeSoilType({ id: soil.id, value: soil.isLiked ? 0 : 1 }))}
    >
      <Icon name="heart" />
      {soil.likesCount}
    </button>
  );
}
