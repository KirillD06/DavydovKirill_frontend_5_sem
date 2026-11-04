import { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SOIL_TYPES, nextSoilType } from "../data/soil-types";
import { SoilVideo } from "../components/SoilVideo";
import { Icon } from "../components/Icon";
import { usePageTitle } from "../hooks/usePageTitle";

export function FeedPage() {
  const [soil, setSoil] = useState(SOIL_TYPES[0]);
  usePageTitle(`Лента · ${soil.name}`);
  return (
    <section className="soil-feed" aria-label="Лента типов грунта">
      <SoilVideo key={soil.id} soil={soil} />
      <div className="soil-feed-shade" />
      <div className="soil-feed-top">
        ТИПЫ ГРУНТА{" "}
        <span>
          {SOIL_TYPES.findIndex((item) => item.id === soil.id) + 1} /{" "}
          {SOIL_TYPES.length}
        </span>
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
            <span className="soil-likes">
              <Icon name="heart" />
              <span className="visually-hidden">Лайков: </span>
              <span>{soil.likesCount}</span>
            </span>
            <span className="soil-feed-stat">
              <strong>{soil.looseningFactor.toFixed(2).replace(".", ",")}</strong>
              <small>K</small>
            </span>
            <span className="soil-feed-stat">
              <strong>{soil.density.toFixed(2).replace(".", ",")}</strong>
              <small>т/м³</small>
            </span>
          </aside>
          <Button
            className="soil-feed-next"
            variant="warning"
            onClick={() => setSoil(nextSoilType(soil.id, SOIL_TYPES)!)}
            aria-label="Следующий грунт"
          >
            <Icon name="next" />
          </Button>
        </div>
      </div>
    </section>
  );
}
