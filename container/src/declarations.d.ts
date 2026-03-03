declare module "policiesApp/App" {
  import type React from "react";
  import type { Policy } from "./types";

  export interface PoliciesAppProps {
    onSelectPolicy: (policy: Policy) => void;
  }

  const Component: React.ComponentType<PoliciesAppProps>;
  export default Component;
}

declare module "paymentsApp/App" {
  import type React from "react";
  import type { Policy } from "./types";

  export interface PaymentsAppProps {
    selectedPolicy: Policy | null;
  }

  const Component: React.ComponentType<PaymentsAppProps>;
  export default Component;
}

