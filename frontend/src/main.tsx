import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AdminApp } from "./admin/AdminApp.tsx";
import { ResetPasswordPage } from "./customer/ResetPasswordPage.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { LegalPage } from "./pages/LegalPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { initializeAnalytics } from "./utils/analytics.ts";

initializeAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary><BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/termos" element={<LegalPage type="terms" />} />
        <Route path="/privacidade" element={<LegalPage type="privacy" />} />
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<App />} />
        <Route path="/checkout" element={<App />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter></ErrorBoundary>
  </StrictMode>,
);
