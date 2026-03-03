import React, { Suspense, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { Policy } from "./types";
import "./styles.scss";

const PoliciesApp = React.lazy(() => import("policiesApp/App"));
const PaymentsApp = React.lazy(() => import("paymentsApp/App"));

function AppRoutes() {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Insurance Portal</h1>
        <nav>
          <Link to="/policies">My Policies</Link>
          <Link to="/pay">Pay Premium</Link>
        </nav>
      </header>
      <main className="app-main">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/policies"
              element={
                <PoliciesApp
                  onSelectPolicy={(policy) => {
                    setSelectedPolicy(policy);
                    navigate("/pay");
                  }}
                />
              }
            />
            <Route
              path="/pay"
              element={<PaymentsApp selectedPolicy={selectedPolicy} />}
            />
            <Route
              path="*"
              element={
                <div>
                  <p>Welcome to the Insurance Portal.</p>
                  <p>Select "My Policies" to get started.</p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

