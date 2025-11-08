"use client";

export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="widget not-found-widget">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
        <a href="/" className="not-found-link">
          Go Back Home
        </a>
      </div>
    </div>
  );
}