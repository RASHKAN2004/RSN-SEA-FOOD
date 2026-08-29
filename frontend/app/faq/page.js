import FaqAccordion from '@/components/FaqAccordion';

export const metadata = {
  title: 'FAQ | RSN Sea Food',
  description: 'Frequently asked questions about ordering, delivery, and payment at RSN Sea Food.',
};

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="section-title text-center">Frequently Asked Questions</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
        Everything you need to know about ordering fresh seafood from RSN Sea Food.
      </p>
      <div className="mt-8">
        <FaqAccordion />
      </div>
    </section>
  );
}
