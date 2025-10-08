import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lluís Cánovas - Fotografia i Disseny gràfic",
  description: "Portfoli de fotografia i disseny gràfic de Lluís Cánovas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}