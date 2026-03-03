import React, { useEffect, useRef, useState } from "react";
import { Policy } from "./types";
import "./styles.scss";

export interface PremiumPaymentAppProps {
  selectedPolicy: Policy | null;
}

interface ScheduleItem {
  installment: number;
  amount: number;
}

const PAYMENTS_KEY = "payments";
const POLICIES_KEY = "policies";

function createPremiumWorker() {
  const workerCode = `
    self.onmessage = (event) => {
      const amount = event.data.amount;
      const installments = event.data.installments;

      // Simulate some heavy work.
      let total = 0;
      for (let i = 0; i < 5000000; i += 1) {
        total += i % 7;
      }

      const schedule = [];
      const perInstallment = amount / Math.max(installments, 1);
      for (let i = 1; i <= installments; i += 1) {
        schedule.push({
          installment: i,
          amount: Number(perInstallment.toFixed(2))
        });
      }

      self.postMessage({ success: true, schedule });
    };
  `;

  const blob = new Blob([workerCode], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  return {
    worker,
    cleanup: () => URL.revokeObjectURL(url)
  };
}

function savePayment(policy: Policy, amount: number) {
  const raw = window.localStorage.getItem(PAYMENTS_KEY);
  const list = raw ? (JSON.parse(raw) as any[]) : [];
  list.push({
    id: `${Date.now()}`,
    policyId: policy.id,
    amount,
    date: new Date().toISOString(),
    status: "SUCCESS"
  });
  window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify(list));

  // Also update policy status to PAID.
  const policiesRaw = window.localStorage.getItem(POLICIES_KEY);
  if (policiesRaw) {
    try {
      const policies = JSON.parse(policiesRaw) as Policy[];
      const updated = policies.map((p) =>
        p.id === policy.id ? { ...p, status: "PAID" as const } : p
      );
      window.localStorage.setItem(POLICIES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
}

const PremiumPaymentApp: React.FC<PremiumPaymentAppProps> = ({ selectedPolicy }) => {
  const [amount, setAmount] = useState<number | "">("");
  const [installments, setInstallments] = useState(1);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Reset form when policy changes.
    setAmount(selectedPolicy ? selectedPolicy.premiumAmount : "");
    setInstallments(1);
    setSchedule([]);
    setMessage(null);
  }, [selectedPolicy]);

  useEffect(() => {
    // Cleanup worker on unmount.
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  if (!selectedPolicy) {
    return (
      <div className="payments-card">
        <h2>Pay Premium</h2>
        <p>No policy selected. Please go back to "My Policies" and choose a policy.</p>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (amount === "" || amount <= 0 || installments <= 0) {
      setMessage("Please enter a valid amount and number of installments.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setSchedule([]);

    const { worker, cleanup } = createPremiumWorker();
    workerRef.current = worker;
    worker.onmessage = (e: MessageEvent<{ success: boolean; schedule: ScheduleItem[] }>) => {
      setLoading(false);
      if (e.data.success) {
        setSchedule(e.data.schedule);
        setMessage("Payment calculation completed. Payment marked as successful.");
        savePayment(selectedPolicy, typeof amount === "number" ? amount : Number(amount));
      } else {
        setMessage("Payment calculation failed.");
      }
      worker.terminate();
      workerRef.current = null;
      cleanup();
    };
    worker.onerror = () => {
      setLoading(false);
      setMessage("Payment worker failed to run.");
      worker.terminate();
      workerRef.current = null;
      cleanup();
    };
    worker.postMessage({
      amount: typeof amount === "number" ? amount : Number(amount),
      installments
    });
  };

  return (
    <div className="payments-card">
      <h2>Pay Premium</h2>
      <section className="policy-summary">
        <h3>Policy Summary</h3>
        <p>
          <strong>Policy #:</strong> {selectedPolicy.policyNumber}
        </p>
        <p>
          <strong>Type:</strong> {selectedPolicy.type}
        </p>
        <p>
          <strong>Status:</strong> {selectedPolicy.status}
        </p>
        <p>
          <strong>Next Due Date:</strong> {selectedPolicy.nextDueDate}
        </p>
      </section>

      <form className="payment-form" onSubmit={handleSubmit}>
        <label>
          Premium Amount (₹)
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </label>
        <label>
          Number of Installments
          <input
            type="number"
            min={1}
            max={12}
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Confirm & Calculate"}
        </button>
      </form>

      {message && <p className="payment-message">{message}</p>}

      {schedule.length > 0 && (
        <section className="schedule">
          <h3>Installment Schedule</h3>
          <ul>
            {schedule.map((item) => (
              <li key={item.installment}>
                Installment {item.installment}: ₹{item.amount}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default PremiumPaymentApp;

