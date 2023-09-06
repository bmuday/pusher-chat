"use client";
import Header from "./Header";
import Footer from "./Footer";

export default function Body({ children }) {

  return (
    <body className="flex flex-col justify-between h-full w-full">
      <Header />
      {children}
      <Footer />
    </body>
  );
}
