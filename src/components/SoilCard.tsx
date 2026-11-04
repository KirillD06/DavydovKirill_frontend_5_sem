import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { SoilType } from "../types/soil-type";
import { SoilImage } from "./SoilImage";
import { Icon } from "./Icon";

export function SoilCard({ soil }: { soil: SoilType }) {
  return (
    <Card
      as={Link}
      to={`/soil_types/${soil.id}`}
      className="soil-card"
      aria-label={`Подробнее: ${soil.name}`}
    >
      <div className="soil-card-media">
        <SoilImage
          src={soil.imageUrl}
          name={soil.name}
          className="soil-card-image"
        />
        <span className="soil-card-likes soil-likes">
          <Icon name="heart" />
          <span className="visually-hidden">Лайков: </span>
          <span>{soil.likesCount}</span>
        </span>
      </div>
      <Card.Body>
        <Card.Title as="h2">{soil.name}</Card.Title>
        <dl className="soil-card-stats">
          <div>
            <dt>Разрыхление</dt>
            <dd>{soil.looseningFactor.toFixed(2).replace(".", ",")}</dd>
          </div>
          <div>
            <dt>Плотность</dt>
            <dd>{soil.density.toFixed(2).replace(".", ",")} т/м³</dd>
          </div>
        </dl>
      </Card.Body>
    </Card>
  );
}
