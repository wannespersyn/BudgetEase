'use client';

import Navbar from "../../../../components/navbar";
import styles from "../../../../styles/TransactionInput.module.css";

export default function InvoiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.body}>
      <Navbar active="Invoice" />
      {children}
    </div>
  );
}
