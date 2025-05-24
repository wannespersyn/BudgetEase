import styles from './styles.module.css';

export default function TransactionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.body}>
        {children}
      </body>
    </html>
  );
}