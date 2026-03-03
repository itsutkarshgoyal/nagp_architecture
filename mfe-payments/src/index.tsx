import React from "react";
import { createRoot } from "react-dom/client";
import PremiumPaymentApp from "./PremiumPaymentApp";
import { Policy } from "./types";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  const mockPolicy: Policy = {
    id: "demo",
    policyNumber: "POL-DEMO",
    type: "Demo Insurance",
    status: "ACTIVE",
    premiumAmount: 4000,
    nextDueDate: "2026-03-20"
  };

  root.render(<PremiumPaymentApp selectedPolicy={mockPolicy} />);
}

