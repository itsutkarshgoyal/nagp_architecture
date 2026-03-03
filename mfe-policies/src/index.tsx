import React from "react";
import { createRoot } from "react-dom/client";
import PolicyDashboardApp from "./PolicyDashboardApp";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <PolicyDashboardApp
      // When running standalone, just log the selection.
      onSelectPolicy={(policy) => {
        // eslint-disable-next-line no-console
        console.log("Selected policy (standalone):", policy);
      }}
    />
  );
}

