import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harborwell connect rate",
  description: "Ops dashboard for CAPI Purchase matchability",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
