import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AnalyticsPage} from "./pages/analytics/page";
import {EmployeesPage} from "./pages/employees/page";
import {AuthorizationPage} from "./pages/authorization/page";
import {SideBar} from "./components/side-bar";
import {AdminLayout} from "./layout/admin-layout";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              {/*<Route path="/" element={<Navigate to="/analytics" replace />} />*/}
              <Route path="/" element={<AuthorizationPage />} />
              <Route path="/analytics" element={<AdminLayout><AnalyticsPage /></AdminLayout>} />
              <Route path="/employees" element={<AdminLayout><EmployeesPage /></AdminLayout>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
