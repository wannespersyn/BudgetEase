'use client';

import Navbar from "../../../../components/navbar";
import styles from "../../../../styles/GoalInput.module.css";

export default function GoalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.body}>
      <Navbar active="Goal" />
      {children}
    </div>
  );
}
