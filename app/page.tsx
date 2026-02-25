// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Senjoro Pay UI</h1>
      <p>Your payment dashboard and test pages.</p>

      <p>
        Example: view a test transaction:
        {/* <Link href="/success/ORD-1001-71c63f8b-51fc-4952-bdc7-88537f251d72">
          <span style={{ color: 'blue', marginLeft: 5, cursor: 'pointer' }}>
            Open Transaction
          </span>
        </Link> */}
      </p>
    </div>
  );
}