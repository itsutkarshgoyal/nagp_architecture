import { Policy } from "./types";

const POLICIES_KEY = "policies";

const seedPolicies: Policy[] = [
  {
    id: "1",
    policyNumber: "POL-1001",
    type: "Health Insurance",
    status: "ACTIVE",
    premiumAmount: 5000,
    nextDueDate: "2026-03-15"
  },
  {
    id: "2",
    policyNumber: "POL-1002",
    type: "Life Insurance",
    status: "ACTIVE",
    premiumAmount: 8000,
    nextDueDate: "2026-04-01"
  },
  {
    id: "3",
    policyNumber: "POL-1003",
    type: "Vehicle Insurance",
    status: "LAPSED",
    premiumAmount: 3000,
    nextDueDate: "2025-12-10"
  },
  {
    id: "4",
    policyNumber: "POL-1004",
    type: "Home Insurance",
    status: "ACTIVE",
    premiumAmount: 6500,
    nextDueDate: "2026-03-22"
  },
  {
    id: "5",
    policyNumber: "POL-1005",
    type: "Travel Insurance",
    status: "ACTIVE",
    premiumAmount: 2200,
    nextDueDate: "2026-03-05"
  },
  {
    id: "6",
    policyNumber: "POL-1006",
    type: "Health Insurance",
    status: "ACTIVE",
    premiumAmount: 5400,
    nextDueDate: "2026-04-10"
  },
  {
    id: "7",
    policyNumber: "POL-1007",
    type: "Life Insurance",
    status: "ACTIVE",
    premiumAmount: 9100,
    nextDueDate: "2026-05-01"
  },
  {
    id: "8",
    policyNumber: "POL-1008",
    type: "Vehicle Insurance",
    status: "ACTIVE",
    premiumAmount: 3600,
    nextDueDate: "2026-03-30"
  },
  {
    id: "9",
    policyNumber: "POL-1009",
    type: "Home Insurance",
    status: "LAPSED",
    premiumAmount: 7200,
    nextDueDate: "2025-11-15"
  },
  {
    id: "10",
    policyNumber: "POL-1010",
    type: "Travel Insurance",
    status: "ACTIVE",
    premiumAmount: 1800,
    nextDueDate: "2026-04-18"
  }
];

function setPolicies(policies: Policy[]) {
  window.localStorage.setItem(POLICIES_KEY, JSON.stringify(policies));
}

export function getPolicies(): Policy[] {
  const raw = window.localStorage.getItem(POLICIES_KEY);
  if (!raw) {
    setPolicies(seedPolicies);
    return seedPolicies;
  }

  try {
    const parsed = JSON.parse(raw) as Policy[];
    return parsed;
  } catch {
    setPolicies(seedPolicies);
    return seedPolicies;
  }
}

export function resetPoliciesToSeed(): Policy[] {
  setPolicies(seedPolicies);
  return seedPolicies;
}

export function addRandomActivePolicy(): Policy[] {
  const existing = getPolicies();
  const nextId = String(Date.now());
  const nextPolicyNumber = `POL-${Math.floor(1000 + Math.random() * 9000)}`;
  const types = ["Health Insurance", "Life Insurance", "Vehicle Insurance", "Home Insurance", "Travel Insurance"];
  const type = types[Math.floor(Math.random() * types.length)] ?? "Health Insurance";
  const premiumAmount = Math.floor(1500 + Math.random() * 9000);
  const due = new Date();
  due.setDate(due.getDate() + 7 + Math.floor(Math.random() * 60));

  const next: Policy = {
    id: nextId,
    policyNumber: nextPolicyNumber,
    type,
    status: "ACTIVE",
    premiumAmount,
    nextDueDate: due.toISOString().slice(0, 10)
  };

  const updated = [next, ...existing];
  setPolicies(updated);
  return updated;
}

