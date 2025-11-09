export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-10 py-6">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} Share Spot. All rights reserved.</p>
      </div>
    </footer>
  );
}
