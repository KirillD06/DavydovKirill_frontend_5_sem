import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { filterSoilTypes } from "./data/soil-types";
import { TabBar } from "./components/TabBar";
import { CatalogPage } from "./pages/CatalogPage";
import { FeedPage } from "./pages/FeedPage";
import { SoilDetailPage } from "./pages/SoilDetailPage";

export function App() {
  const [value, setValue] = useState(1.5);
  const [maxLoosening, setMaxLoosening] = useState(1.5);
  const soils = filterSoilTypes(maxLoosening);
  function reset() {
    setValue(1.5);
    setMaxLoosening(1.5);
  }
  return (
    <div className="soil-shell">
      <main className="soil-content">
        <Routes>
          <Route path="/" element={<Navigate to="/soil_types" replace />} />
          <Route
            path="/soil_types"
            element={
              <CatalogPage
                soils={soils}
                value={value}
                onChange={setValue}
                onApply={() => setMaxLoosening(value)}
                onReset={reset}
              />
            }
          />
          <Route path="/soil_types/feed" element={<FeedPage />} />
          <Route
            path="/soil_types/:id"
            element={<SoilDetailPage soils={soils} />}
          />
          <Route
            path="*"
            element={
              <section className="soil-page">
                <h1>Страница не найдена</h1>
                <a href="/soil_types">Открыть каталог</a>
              </section>
            }
          />
        </Routes>
      </main>
      <TabBar />
    </div>
  );
}
