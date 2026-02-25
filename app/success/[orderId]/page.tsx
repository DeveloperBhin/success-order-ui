// app/success/[orderId]/page.tsx
import React from 'react';

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

export default async function SuccessPage({ params }: Props) {
  const { orderId } = params;

  let transaction: Transaction | null = null;

  try {
    const res = await fetch(
      `https://api.senjaropay.com/senjaropay/paybylink/payment-redirect${orderId}`,
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error('Failed to fetch transaction');

    const data = await res.json();

    transaction = {
      transactionId: data.transactionId,
      status: data.status,
      selcomStatus: data.selcomStatus,
      amount: data.selcom?.amount || '0',
      creationDate: data.selcom?.creation_date || '',
    };
  } catch (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40vh' }}>
        Error loading transaction. Please try again.
      </div>
    );
  }

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

  const isSuccess = transaction.status === 'SUCCESS';
  const title = isSuccess ? '✅ Payment Success!' : '❌ Payment Failed';
  const subtitle = isSuccess
    ? 'Your payment was successful.'
    : 'Your payment could not be completed.';

  return (
    <div style={styles.page as React.CSSProperties}>
      <div style={styles.card as React.CSSProperties}>
        <div style={styles.logo as React.CSSProperties}>Senjoro Pay</div>

        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>Transaction ID: {transaction.transactionId}</p>
        <p style={styles.subtitle}>Amount: ${transaction.amount}</p>
        <p style={styles.subtitle}>
          Status: {transaction.status} ({transaction.selcomStatus})
        </p>
        <p style={styles.subtitle}>{subtitle}</p>

        <button style={styles.downloadBtn as React.CSSProperties} onClick={downloadReceipt}>
          ⬇️ Download receipt
        </button>

        {!isSuccess && (
          <a
            href={`https://paylink-senjaropay.com/pay/${orderId}`}
            style={styles.retryBtn as React.CSSProperties}
          >
            🔄 Retry Payment
          </a>
        )}

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
  logo: {
    position: 'absolute' as const,
    left: 24,
    top: 18,
    fontSize: 14,
    color: '#2b2b2b',
    fontWeight: 600,
    opacity: 0.7,
  },
  title: { margin: '18px 0 6px', fontSize: 24, fontWeight: 700, color: '#111827' },
  subtitle: { margin: '6px 0', color: '#6b7280', fontSize: 14 },
  downloadBtn: {
    marginTop: 20,
    width: '100%',
    padding: '14px 18px',
    borderRadius: 999,
    background: '#166534',
    color: 'white',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
  },
  retryBtn: {
    display: 'inline-block',
    marginTop: 12,
    padding: '12px 18px',
    borderRadius: 999,
    background: '#b91c1c',
    color: 'white',
    fontSize: 16,
    textDecoration: 'none',
    cursor: 'pointer',
  },
  footer: { marginTop: 18, color: '#9ca3af', fontSize: 12 },
};