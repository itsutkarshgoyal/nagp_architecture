export interface Policy {
  id: string;
  policyNumber: string;
  type: string;
  status: "ACTIVE" | "PAID" | "LAPSED";
  premiumAmount: number;
  nextDueDate: string;
}

