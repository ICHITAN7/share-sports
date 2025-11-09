import Header from "./components/header";
import Footer from "./components/footer";
import bg from "./asset/image/background.jpg"
// @ts-ignore: allow importing global css without type declarations
import "./globals.css";
import type { ReactNode } from "react";
export default function DefaultLayout({ children } : { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container mx-auto p-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
