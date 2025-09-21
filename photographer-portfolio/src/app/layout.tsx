import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lluís Canovas - Photography and Graphic Design",
  description: "Photography and Graphic Design Portfolio by Lluís Canovas",
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