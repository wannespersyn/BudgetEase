import type { Metadata } from "next";


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
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
