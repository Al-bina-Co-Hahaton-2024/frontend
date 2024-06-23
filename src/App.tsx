import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AnalyticsPage } from './pages/analytics/page';
import { EmployeesPage } from './pages/employees/page';
import { AuthorizationPage } from './pages/authorization/page';
import { AdminLayout } from './layout/admin-layout';
import { AcceptanceUsersPage } from './pages/acceptence/page';
import { ForecastDiffPage, ForecastPage } from './pages/forecast/page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { _404Page } from './pages/404/page';
import { DoctorPage } from './pages/doctor/page';
import { LayoutPageForecast } from './pages/forecast/layout-page';

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
                <LayoutPageForecast />
              </AdminLayout>
            }
          />
          <Route
            path="/404"
            element={
              <AdminLayout>
                <_404Page />
              </AdminLayout>
            }
          />
          <Route
            path="/acc_users"
            element={
              <AdminLayout>
                <_404Page />
              </AdminLayout>
            }
          />
          <Route
            path="/lk"
            element={
              <AdminLayout>
                <DoctorPage />
              </AdminLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
