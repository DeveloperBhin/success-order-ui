// app/success/[orderId]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  amount: number;
  status: string;
}

interface Props {
  params: { orderId: string };
}

export default function SuccessPage({ params }: Props) {
  const { orderId } = params;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(
          `https://api.senjaropay.com/senjaropay/paybylink/payment-redirect/${orderId}`,
          { cache: 'no-store' }
        );

        if (!res.ok) throw new Error('Failed to fetch transaction');

        const data = await res.json();
        setTransaction(data);
      } catch (err) {
        setError('Error loading transaction. Please try again.');
      }
    };

    fetchTransaction();
  }, [orderId]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40vh' }}>
        {error}
      </div>
    );
  }

  if (!transaction) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40vh' }}>
        Loading...
      </div>
    );
  }

  // Download receipt function
  const downloadReceipt = () => {
    if (!transaction) return;

    const receipt = `
✅ Senjoro Pay Receipt

Transaction ID: ${transaction.id}
Amount: $${transaction.amount}
Status: ${transaction.status}

Thank you for your payment!
    `;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${transaction.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div style={styles.page as React.CSSProperties}>
      <div style={styles.card as React.CSSProperties}>
        <div style={styles.logo as React.CSSProperties}>Senjoro Pay</div>

        <h1 style={styles.title}>✅ Payment Success!</h1>
        <p style={styles.subtitle}>Transaction ID: {transaction.id}</p>
        <p style={styles.subtitle}>Amount: ${transaction.amount}</p>
        <p style={styles.subtitle}>Status: {transaction.status}</p>

        <button style={styles.downloadBtn as React.CSSProperties} onClick={downloadReceipt}>
          ⬇️ Download receipt
        </button>

        <div style={styles.footer as React.CSSProperties}>Powered by Senjoro Pay</div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7f7f9',
    padding: 24,
  },
  card: {
    width: 600,
    maxWidth: '95%',
    background: 'white',
    borderRadius: 18,
    padding: '36px 36px 28px',
    boxShadow: '0 10px 30px rgba(16,24,40,0.08)',
    textAlign: 'center' as const,
    position: 'relative' as const,
  },
  logo: { position: 'absolute' as const, left: 24, top: 18, fontSize: 14, color: '#2b2b2b', fontWeight: 600, opacity: 0.7 },
  title: { margin: '18px 0 6px', fontSize: 24, fontWeight: 700, color: '#111827' },
  subtitle: { margin: 0, color: '#6b7280', fontSize: 14 },
  downloadBtn: { marginTop: 20, width: '100%', padding: '14px 18px', borderRadius: 999, background: '#166534', color: 'white', border: 'none', fontSize: 16, cursor: 'pointer' },
  footer: { marginTop: 18, color: '#9ca3af', fontSize: 12 },
};