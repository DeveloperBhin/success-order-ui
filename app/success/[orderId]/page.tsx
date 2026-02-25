'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session') || '9f2991be-8c76-4efc-9340-d90c6fa1c647'; // read ?session= from URL

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const res = await fetch(
          'https://api.senjaropay.com/senjaropay/paybylink/checkStatus',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-session-id': sessionId, // pass session
            },
            body: JSON.stringify({ transactionId: orderId }),
          }
        );

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

    fetchTransaction();
  }, [orderId, sessionId]);

  if (loading)
    return <div style={{ textAlign: 'center', marginTop: '40vh' }}>Loading...</div>;

  if (error || !transaction)
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2>Error loading transaction</h2>
        <p>
          Make sure your session ID is correct and included in the URL as
          <br />
          <code>?session=YOUR_SESSION_ID</code>
        </p>
      </div>
    );

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