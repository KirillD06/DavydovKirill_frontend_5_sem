import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatSoilNumber } from "../types/soil-type";
import { useAppDispatch, useAppSelector } from "../store";
import { loadSoilType } from "../store/soilTypesThunks";
import { RequestStatus } from "../components/RequestStatus";
import { SoilLikes } from "../components/SoilLikes";
import { SoilVideo } from "../components/SoilVideo";
import { Icon } from "../components/Icon";
import { usePageTitle } from "../hooks/usePageTitle";

export function FeedPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const feed = useAppSelector((state) => state.soilTypes.feed);
  const mutation = useAppSelector((state) => state.soilTypes.mutation);
  const soil = feed.value?.data;
  const pending = Boolean(feed.requestId || mutation.requestId);
  usePageTitle(soil ? `Лента · ${soil.name}` : "Лента");

  useEffect(() => {
    const request = dispatch(loadSoilType({}));
    return () => request.abort();
  }, [dispatch, user]);

  if (!soil) {
    return (
      <section className="soil-page">
        <h1>Лента грунтов</h1>
        <RequestStatus pending={pending} error={feed.error} />
        {feed.value && <p>Опубликованных грунтов пока нет.</p>}
      </section>
    );
  }
  return (
    <section className="soil-feed" aria-label="Лента типов грунта">
      <SoilVideo key={soil.id} soil={soil} />
      <div className="soil-feed-shade" />
      <div className="soil-feed-top">
        ТИПЫ ГРУНТА{" "}
        {feed.value?.source === "mock" && <span>Учебные данные</span>}
      </div>
      <div className="soil-feed-status">
        <RequestStatus pending={pending} error={feed.error || mutation.error} />
      </div>
      <div className="soil-feed-bottom">
        <div className="soil-feed-content">
          <h1>{soil.name}</h1>
          <details key={soil.id} className="soil-description">
            <summary>
              <span className="soil-description-text">{soil.description}</span>
              <span className="soil-expand">Ещё</span>
              <span className="soil-collapse">Скрыть</span>
            </summary>
          </details>
          <Link className="soil-more" to={`/soil_types/${soil.id}`}>
            Подробнее о грунте <Icon name="next" />
          </Link>
        </div>
        <div className="soil-feed-rail">
          <aside className="soil-feed-values" aria-label="Характеристики грунта">
            <SoilLikes soil={soil} busy={pending} />
            <span className="soil-feed-stat">
              <strong>{formatSoilNumber(soil.looseningFactor)}</strong>
              <small>K</small>
            </span>
            <span className="soil-feed-stat">
              <strong>{formatSoilNumber(soil.density)}</strong>
              <small>т/м³</small>
            </span>
          </aside>
          <Button
            className="soil-feed-next"
            variant="warning"
            disabled={pending}
            onClick={() => void dispatch(loadSoilType({ id: soil.id, next: "true" }))}
            aria-label="Следующий грунт"
          >
            <Icon name="next" />
          </Button>
        </div>
      </div>
    </section>
  );
}
