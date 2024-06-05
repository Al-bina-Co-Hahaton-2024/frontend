import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AnalyticsPage} from "./pages/analytics/page";
import {EmployeesPage} from "./pages/employees/page";
import {AuthorizationPage} from "./pages/authorization/page";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              {/*<Route path="/" element={<Navigate to="/analytics" replace />} />*/}
              <Route path="/" element={<AuthorizationPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
