import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "BudgetEase",
  description: "BudgetEase is an finance app that helps you manage your money.",
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
