import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnalyticsPage } from './pages/analytics/page';
import { EmployeesPage } from './pages/employees/page';
import { AuthorizationPage } from './pages/authorization/page';
import { AdminLayout } from './layout/admin-layout';
import { AcceptanceUsersPage } from './pages/acceptence/page';
import { ForecastPage } from './pages/forecast/page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/*<Route path="/" element={<Navigate to="/analytics" replace />} />*/}
          <Route path="/" element={<AuthorizationPage />} />
          <Route
            path="/analytics"
            element={
              <AdminLayout>
                <AnalyticsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/employees"
            element={
              <AdminLayout>
                <EmployeesPage />
              </AdminLayout>
            }
          />
          <Route
            path="/accept_users"
            element={
              <AdminLayout>
                <AcceptanceUsersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/accept_users"
            element={
              <AdminLayout>
                <AcceptanceUsersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/forecast"
            element={
              <AdminLayout>
                <ForecastPage />
              </AdminLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
