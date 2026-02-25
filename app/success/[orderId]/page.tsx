'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  transactionId: string;
  status: string;
  selcomStatus: string;
  amount: string;
  creationDate?: string;
}

export default function SuccessPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch('https://api.senjaropay.com/senjaropay/paybylink/checkStatus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId: orderId })
        });
        const data = await res.json();

        setTransaction({
          transactionId: data.transactionId,
          status: data.status,
          selcomStatus: data.selcomStatus,
          amount: data.selcom?.amount || '0',
          creationDate: data.selcom?.creation_date || '',
        });
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [orderId]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '40vh' }}>Loading...</div>;
  if (error || !transaction) return <div style={{ textAlign: 'center', marginTop: '40vh' }}>Error loading transaction. Please try again.</div>;

  const isSuccess = transaction.status === 'SUCCESS';
  const downloadReceipt = () => {
    const receipt = `
✅ Senjoro Pay Receipt

Transaction ID: ${transaction.transactionId}
Amount: $${transaction.amount}
Status: ${transaction.status} (${transaction.selcomStatus})
Date: ${transaction.creationDate}

Thank you for using Senjoro Pay!
    `;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${transaction.transactionId}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div style={{ textAlign: 'center', padding: 32 }}>
      <h1>{isSuccess ? '✅ Payment Success!' : '❌ Payment Failed'}</h1>
      <p>Transaction ID: {transaction.transactionId}</p>
      <p>Amount: ${transaction.amount}</p>
      <p>Status: {transaction.status} ({transaction.selcomStatus})</p>
      <button onClick={downloadReceipt}>⬇️ Download receipt</button>
      {!isSuccess && <a href={`https://paylink-senjaropay.com/pay/${transaction.transactionId}`}>🔄 Retry Payment</a>}
    </div>
  );
}