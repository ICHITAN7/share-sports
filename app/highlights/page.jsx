import mockHighlights from "../data2";

export default function HighlightsPage() {
  return (
    <section className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Highlights</h2>
      <ul className="space-y-4">
        {mockHighlights.map((highlight) => (
          <li key={highlight.id} className="border-b pb-4">
            <h3 className="text-xl font-semibold">{highlight.title}</h3>
            <p className="text-sm text-gray-500">{highlight.date}</p>
            <p className="mt-2">{highlight.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
