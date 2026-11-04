import { Alert } from "react-bootstrap";
import type { SoilType } from "../types/soil-type";
import { SoilCard } from "../components/SoilCard";
import { LooseningFilter } from "../components/LooseningFilter";
import { usePageTitle } from "../hooks/usePageTitle";

interface Props {
  soils: readonly SoilType[];
  value: number;
  onChange: (value: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export function CatalogPage({ soils, ...filter }: Props) {
  usePageTitle("Каталог");
  return (
    <section className="soil-page">
      <h1>Типы грунтов</h1>
      <LooseningFilter {...filter} />
      <p className="soil-result" aria-live="polite">
        Найдено: {soils.length}
      </p>
      {soils.length ? (
        <div className="soil-grid">
          {soils.map((soil) => (
            <SoilCard key={soil.id} soil={soil} />
          ))}
        </div>
      ) : (
        <Alert variant="light">
          По выбранному коэффициенту грунты не найдены. Увеличьте значение или
          сбросьте фильтр.
        </Alert>
      )}
    </section>
  );
}
