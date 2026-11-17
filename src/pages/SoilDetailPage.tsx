import { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatSoilNumber } from "../types/soil-type";
import { nextSoilType } from "../data/soil-types";
import { useAppDispatch, useAppSelector } from "../store";
import { loadSoilType } from "../store/soilTypesThunks";
import { RequestStatus } from "../components/RequestStatus";
import { SoilLikes } from "../components/SoilLikes";
import { SoilVideo } from "../components/SoilVideo";
import { Icon } from "../components/Icon";
import { usePageTitle } from "../hooks/usePageTitle";

export function SoilDetailPage() {
  const { id } = useParams();
  const soilId = id && /^[1-9][0-9]*$/.test(id) ? Number(id) : null;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { catalog, feed, mutation } = useAppSelector((state) => state.soilTypes);
  const soil = feed.value?.data?.id === soilId ? feed.value.data : null;
  const pending = Boolean(feed.requestId || mutation.requestId);
  usePageTitle(soil?.name ?? "Грунт");

  useEffect(() => {
    if (soilId === null) return;
    const request = dispatch(loadSoilType({ id: soilId }));
    return () => request.abort();
  }, [dispatch, soilId, user]);

  if (!soil) {
    return (
      <section className="soil-page">
        <h1>Карточка грунта</h1>
        <RequestStatus pending={pending} error={feed.error} />
        {(soilId === null || (!pending && feed.value && !feed.error)) && (
          <Alert variant="light">Карточки с таким номером нет.</Alert>
        )}
        <Link to="/soil_types">Вернуться в каталог</Link>
      </section>
    );
  }

  async function openNext() {
    if (!soil) return;
    const filtered = catalog.value?.data;
    if (filtered?.some((item) => item.id === soil.id)) {
      const next = nextSoilType(soil.id, filtered);
      if (next) navigate(`/soil_types/${next.id}`);
      return;
    }
    const result = await dispatch(loadSoilType({ id: soil.id, next: "true" }));
    if (loadSoilType.fulfilled.match(result) && result.payload.data) {
      navigate(`/soil_types/${result.payload.data.id}`);
    }
  }
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
            <dd>{formatSoilNumber(soil.looseningFactor)}</dd>
          </div>
          <div>
            <dt>Плотность</dt>
            <dd>{formatSoilNumber(soil.density, " т/м³")}</dd>
          </div>
          <div>
            <dt>Количество лайков</dt>
            <dd className="soil-likes">
              <SoilLikes soil={soil} busy={pending} />
            </dd>
          </div>
        </dl>
        <RequestStatus pending={pending} error={feed.error || mutation.error} />
        <Button
          disabled={pending}
          variant="warning"
          className="w-100"
          onClick={() => void openNext()}
        >
          Следующий грунт <span aria-hidden="true">→</span>
        </Button>
      </div>
    </article>
  );
}
