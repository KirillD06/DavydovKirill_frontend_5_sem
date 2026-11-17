import { Navigate, Route, Routes } from "react-router-dom";
import { TabBar } from "./components/TabBar";
import { CatalogPage } from "./pages/CatalogPage";
import { FeedPage } from "./pages/FeedPage";
import { SoilDetailPage } from "./pages/SoilDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { SoilDraftPage } from "./pages/SoilDraftPage";

export function App() {
  return (
    <div className="soil-shell">
      <main className="soil-content">
        <Routes>
          <Route path="/" element={<Navigate to="/soil_types" replace />} />
          <Route path="/soil_types" element={<CatalogPage />} />
          <Route path="/soil_types/feed" element={<FeedPage />} />
          <Route path="/soil_types/draft" element={<SoilDraftPage />} />
          <Route path="/soil_types/:id" element={<SoilDetailPage />} />
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/soil_types" replace />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  );
}
