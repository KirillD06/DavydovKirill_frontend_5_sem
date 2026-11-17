import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatSoilNumber } from "../types/soil-type";
import type { SoilType } from "../types/soil-type";
import { SoilImage } from "./SoilImage";
import { Icon } from "./Icon";

export function SoilCard({
  soil, busy, onDelete,
}: { soil: SoilType; busy: boolean; onDelete?: () => void }) {
  return (
    <Card className="soil-card">
      <Link
        to={`/soil_types/${soil.id}`}
        className="soil-card-link"
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
            <dd>{formatSoilNumber(soil.looseningFactor)}</dd>
          </div>
          <div>
            <dt>Плотность</dt>
            <dd>{formatSoilNumber(soil.density, " т/м³")}</dd>
          </div>
        </dl>
      </Card.Body>
      </Link>
      {onDelete && (
        <Button variant="outline-danger" size="sm" className="soil-card-delete" disabled={busy} onClick={onDelete}>
          Удалить
        </Button>
      )}
    </Card>
  );
}
