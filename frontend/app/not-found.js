import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-extrabold text-sea-900">404</h1>
      <p className="mt-2 text-gray-500">We couldn&apos;t find that page.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">Back to Home</Link>
    </section>
  );
}
