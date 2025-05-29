'use client';

import Navbar from "../../../../components/navbar";
import styles from "../../../../styles/TransactionInput.module.css";

export default function BudgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.body}>
      <Navbar active="Budget" />
      {children}
    </div>
  );
}
