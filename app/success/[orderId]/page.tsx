'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  transactionId: string;
  status: string;
  selcomStatus: string;
  amount: string;
  creationDate?: string;
}

interface Props {
  params: { orderId: string };
}

export default function SuccessPage({ params }: Props) {
  const { orderId } = params;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Temporary state to store user-provided x-session-id
  const [sessionId, setSessionId] = useState('9f2991be-8c76-4efc-9340-d90c6fa1c647');

  const fetchTransaction = async (sessionIdValue: string) => {
    try {
      const res = await fetch('https://api.senjaropay.com/senjaropay/paybylink/checkStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionIdValue, // <-- pass it here
        },
        body: JSON.stringify({ transactionId: orderId }),
      });

      if (!res.ok) throw new Error('Failed to fetch transaction');

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

  const handleFetch = () => {
    if (!sessionId.trim()) {
      alert('Please enter your session ID');
      return;
    }
    setLoading(true);
    setError(false);
    fetchTransaction(sessionId.trim());
  };

  const downloadReceipt = () => {
    if (!transaction) return;

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

  if (loading)
    return <div style={{ textAlign: 'center', marginTop: '40vh' }}>Loading...</div>;
  if (error || !transaction)
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2>Error loading transaction</h2>
        <p>Please enter your session ID to access your transaction:</p>
        <input
          type="text"
          placeholder="x-session-id"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          style={{ padding: 8, width: 300, marginRight: 8 }}
        />
        <button onClick={handleFetch} style={{ padding: '8px 16px' }}>
          Fetch Transaction
        </button>
      </div>
    );

  const isSuccess = transaction.status === 'SUCCESS';

  return (
    <div style={{ textAlign: 'center', padding: 32 }}>
      <h1>{isSuccess ? '✅ Payment Success!' : '❌ Payment Failed'}</h1>
      <p>Transaction ID: {transaction.transactionId}</p>
      <p>Amount: ${transaction.amount}</p>
      <p>Status: {transaction.status} ({transaction.selcomStatus})</p>
      <p>Date: {transaction.creationDate}</p>

      <button onClick={downloadReceipt} style={{ marginTop: 20, padding: '12px 20px' }}>
        ⬇️ Download receipt
      </button>

      {!isSuccess && (
        <a
          href={`https://paylink-senjaropay.com/pay/${transaction.transactionId}`}
          style={{
            display: 'inline-block',
            marginTop: 12,
            padding: '12px 20px',
            background: '#b91c1c',
            color: 'white',
            borderRadius: 999,
            textDecoration: 'none',
          }}
        >
          🔄 Retry Payment
        </a>
      )}
    </div>
  );
}