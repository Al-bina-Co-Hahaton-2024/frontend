import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AnalyticsPage} from "./pages/analytics/page";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigate to="/analytics" replace />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
