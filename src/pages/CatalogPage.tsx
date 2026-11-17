import { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { SoilCard } from "../components/SoilCard";
import { LooseningFilter } from "../components/LooseningFilter";
import { RequestStatus } from "../components/RequestStatus";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAppDispatch, useAppSelector } from "../store";
import { applySoilFilter, resetSoilFilter, setFilterValue } from "../store/soilFilterSlice";
import { deleteSoilType, loadSoilTypes } from "../store/soilTypesThunks";

export function CatalogPage() {
  usePageTitle("Каталог");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { value, maxLoosening } = useAppSelector((state) => state.soilTypesFilter);
  const catalog = useAppSelector((state) => state.soilTypes.catalog);
  const mutation = useAppSelector((state) => state.soilTypes.mutation);
  const pending = Boolean(catalog.requestId || mutation.requestId);

  useEffect(() => {
    const request = dispatch(loadSoilTypes(maxLoosening));
    return () => request.abort();
  }, [dispatch, maxLoosening, user]);

  return (
    <section className="soil-page" aria-busy={pending}>
      <h1>Типы грунтов</h1>
      <LooseningFilter
        value={value}
        onChange={(next) => dispatch(setFilterValue(next))}
        onApply={() => dispatch(applySoilFilter())}
        onReset={() => dispatch(resetSoilFilter())}
        disabled={pending}
      />
      <RequestStatus pending={pending} error={catalog.error || mutation.error} />
      {catalog.value && !catalog.error && (
        <>
          <p className="soil-result" aria-live="polite">
            Найдено: {catalog.value.data.length}
            {catalog.value.source === "mock" && " · Учебные данные"}
          </p>
          {catalog.value.data.length ? (
            <div className="soil-grid">
              {catalog.value.data.map((soil) => (
                <SoilCard
                  key={soil.id}
                  soil={soil}
                  busy={pending}
                  onDelete={user && soil.isMine ? () => {
                    if (window.confirm(`Удалить «${soil.name}»?`)) {
                      void dispatch(deleteSoilType(soil.id));
                    }
                  } : undefined}
                />
              ))}
            </div>
          ) : (
            <Alert variant="light">По выбранному коэффициенту грунты не найдены.</Alert>
          )}
        </>
      )}
    </section>
  );
}
