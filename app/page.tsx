import React from 'react';

// Drop this file into a Next.js project at `pages/index.jsx` (or use CRA and render it as App).
// It's a self-contained React component with inline styles so you can deploy to Vercel quickly.

export default function SuccessPage() {
  const transactionId = 'Rave-Pages182572158777';
  const amount = '$437';

  function downloadReceipt() {
    const receipt = `Transaction ID: ${transactionId}\nAmount: ${amount}\nStatus: Success\nPowered by Senjoro Pay`;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>Senjoro<br/>Pay</div>

        <div style={styles.iconWrap as React.CSSProperties}>
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#DFF5EA" />
            <path d="M7 12.5l2.5 2.5L17 7" stroke="#1A8A5A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 style={styles.title as React.CSSProperties}>Success!</h1>
        <p style={styles.subtitle as React.CSSProperties}>
          Your payment has been processed successfully
        </p>

        <div style={styles.infoCard as React.CSSProperties}>
          <div style={styles.infoRow as React.CSSProperties}>
            <div style={styles.infoLabel as React.CSSProperties}>Transaction ID</div>
            <div style={styles.infoValue as React.CSSProperties}>{transactionId}</div>
          </div>

          <div style={{ ...styles.infoRow, marginTop: 14 } as React.CSSProperties}>
            <div style={styles.infoLabel as React.CSSProperties}>Amount</div>
            <div style={styles.infoValue as React.CSSProperties}>{amount}</div>
          </div>
        </div>

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
  logo: {
    position: 'absolute' as const,
    left: 24,
    top: 18,
    fontSize: 14,
    color: '#2b2b2b',
    fontWeight: 600,
    opacity: 0.7,
  },
  iconWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 12,
  },
  title: {
    margin: '18px 0 6px',
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
  },
  subtitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: 14,
  },
  infoCard: {
    marginTop: 26,
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 18,
    textAlign: 'left' as const,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  infoValue: {
    color: '#111827',
    fontWeight: 600,
  },
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
  footer: {
    marginTop: 18,
    color: '#9ca3af',
    fontSize: 12,
  },
};
