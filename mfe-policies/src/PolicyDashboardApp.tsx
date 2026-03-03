import React, { useEffect, useState } from "react";
import { Policy } from "./types";
import { addRandomActivePolicy, getPolicies, resetPoliciesToSeed } from "./storage";
import "./styles.scss";

export interface PolicyDashboardAppProps {
  onSelectPolicy: (policy: Policy) => void;
}

const PolicyDashboardApp: React.FC<PolicyDashboardAppProps> = ({ onSelectPolicy }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    setPolicies(getPolicies());
  }, []);

  return (
    <div className="policies-card">
      <div className="policies-header">
        <h2>My Policies</h2>
        <div className="policies-actions">
          <button type="button" className="secondary" onClick={() => setPolicies(getPolicies())}>
            Refresh
          </button>
          <button type="button" className="secondary" onClick={() => setPolicies(resetPoliciesToSeed())}>
            Reset demo data
          </button>
          <button type="button" onClick={() => setPolicies(addRandomActivePolicy())}>
            Add Policy
          </button>
        </div>
      </div>
      {policies.length === 0 ? (
        <p>No policies found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Policy #</th>
              <th>Type</th>
              <th>Status</th>
              <th>Premium</th>
              <th>Next Due</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.policyNumber}</td>
                <td>{policy.type}</td>
                <td>{policy.status}</td>
                <td>₹{policy.premiumAmount}</td>
                <td>{policy.nextDueDate}</td>
                <td>
                  <button
                    onClick={() => onSelectPolicy(policy)}
                    disabled={policy.status !== "ACTIVE"}
                  >
                    Pay Premium
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PolicyDashboardApp;

