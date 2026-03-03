/* eslint-disable no-restricted-globals */

// Simple web worker that simulates a heavy premium calculation.

self.onmessage = (event) => {
  const { amount, installments } = event.data;

  // Simulate some heavy work.
  let total = 0;
  for (let i = 0; i < 5_000_000; i += 1) {
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

  self.postMessage({
    success: true,
    schedule
  });
};

