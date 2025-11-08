"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const pathname = usePathname(); 
  const headerClass = `site-header ${isSticky ? "is-sticky" : ""}`;

  return (
    <header className={headerClass}>
      <div className="header-container header-container--rounded header-container--large">
        <div className="header-filter"></div>
        <div className="header-overlay"></div>
        <div className="header-specular"></div>
        <div className="header-content">
          <Link href="/" className="header__logo">
          <Image
            src="https://sharesport.news/logo/1675071036-logo.jpg"
            alt="Share Sports Logo"
            width={40}
            height={40}
          />
          <h2>Share Sport</h2>
        </Link>
        <div className="header__nav-wrapper">
          <nav className="header__nav">
            <Link
              href="/"
              className={`header__nav-link ${
                pathname === "/" ? "is-active" : ""
              }`}
            >
              HOME
            </Link>
            <Link
              href="/livescore"
              className={`header__nav-link ${
                pathname === "/livescore" ? "is-active" : ""
              }`}
            >
              LIVESCORE
            </Link>
            <Link
              href="/livestream"
              className={`header__nav-link ${
                pathname === "/livestream" ? "is-active" : ""
              }`}
            >
              LIVESTREAM
            </Link>
            <Link
              href="/news"
              className={`header__nav-link ${
                pathname === "/news" ? "is-active" : ""
              }`}
            >
              NEWS
            </Link>
            <Link
              href="/highlights"
              className={`header__nav-link ${
                pathname === "/highlights" ? "is-active" : ""
              }`}
            >
              HIGHLIGHTS
            </Link>
          </nav>
          <button
            className="header__mobile-menu-btn"
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        </div>
      </div>
    </header>
  );
}