import { Alert, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { SoilType } from "../types/soil-type";
import { findSoilType, nextSoilType, SOIL_TYPES } from "../data/soil-types";
import { SoilVideo } from "../components/SoilVideo";
import { Icon } from "../components/Icon";
import { usePageTitle } from "../hooks/usePageTitle";

export function SoilDetailPage({ soils }: { soils: readonly SoilType[] }) {
  const { id } = useParams();
  const soil = findSoilType(id);
  const navigate = useNavigate();
  usePageTitle(soil?.name ?? "Грунт не найден");
  if (!soil)
    return (
      <section className="soil-page">
        <h1>Грунт не найден</h1>
        <Alert variant="light">Карточки с таким номером нет.</Alert>
        <Link to="/soil_types">Вернуться в каталог</Link>
      </section>
    );
  const next = nextSoilType(
    soil.id,
    soils.some((item) => item.id === soil.id) ? soils : SOIL_TYPES,
  )!;
  return (
    <article className="soil-detail">
      <header>
        <Link to="/soil_types" className="soil-back">
          <Icon name="back" />
          Каталог
        </Link>
        <span>О грунте</span>
      </header>
      <div className="soil-detail-media">
        <SoilVideo key={soil.id} soil={soil} />
      </div>
      <div className="soil-detail-body">
        <h1>{soil.name}</h1>
        <p>{soil.description}</p>
        <dl>
          <div>
            <dt>Коэффициент разрыхления</dt>
            <dd>{soil.looseningFactor.toFixed(2).replace(".", ",")}</dd>
          </div>
          <div>
            <dt>Плотность</dt>
            <dd>{soil.density.toFixed(2).replace(".", ",")} т/м³</dd>
          </div>
          <div>
            <dt>Количество лайков</dt>
            <dd className="soil-likes">
              <Icon name="heart" />
              <span>{soil.likesCount}</span>
            </dd>
          </div>
        </dl>
        <Button
          variant="warning"
          className="w-100"
          onClick={() => navigate(`/soil_types/${next.id}`)}
        >
          Следующий грунт <span aria-hidden="true">→</span>
        </Button>
      </div>
    </article>
  );
}
