'use client';

import React, { useRef } from 'react';
import styles from '../styles/InvoiceComponent.module.css';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}
interface InvoiceData {
  organizationName: string;
  organizationEmail: string;
  organizationAddress: string;
  organizationZip: string;
  organizationCity: string;
  organizationCountry: string;

  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientZip: string;
  clientCity: string;
  clientCountry: string;

  invoiceNumber: string;
  date: string;
  dueDate: string;
  currency: string;
  discount: number;
  tax: number;
  notes: string;
  items: InvoiceItem[];
}


export default function InvoicePreview({ invoiceData }: Readonly<{ invoiceData: InvoiceData }>) {
  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    if (!printRef.current) return;
  
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const documentClone = printRef.current.cloneNode(true) as HTMLElement;
  
     printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <link rel="stylesheet" type="text/css" href="/invoice-print.css">
        </head>
        <body></body>
      </html>
    `);

  
    printWindow.document.close(); // belangrijk: anders kun je niets appenden
  
    printWindow.document.body.appendChild(documentClone);
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  }
  

  const total = invoiceData.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    <div>
      <div ref={printRef} className={styles.print}>
        {/* HEADER */}
        <section className={styles.headerContainer}>
          <h1>Invoice</h1>
          <h1>BudgetEase</h1>
        </section>

        {/* DATE & INVOICE NUMBER */}
        <section className={styles.dateAndInvoice}>
          <h3>Date: {invoiceData.date}</h3>
          <h3>Invoice Nr. <strong>{invoiceData.invoiceNumber}</strong></h3>
        </section>

        {/* SENDER & RECEIVER */}
        <section className={styles.senderAndReceiverContainer}>
          <div className="section">
            <div><strong>Sender:</strong></div>
            <div>{invoiceData.organizationName}</div>
            <div>{invoiceData.organizationAddress}</div>
            <div>{invoiceData.organizationZip}, {invoiceData.organizationCity}</div>
            <div>{invoiceData.organizationCountry}</div>
            <div>{invoiceData.organizationEmail}</div>
          </div>
          <div className="section">
            <div><strong>Invoice to:</strong></div>
            <div>{invoiceData.clientName}</div>
            <div>{invoiceData.clientEmail}</div>
            <div>{invoiceData.clientAddress}</div>
            <div>{invoiceData.clientZip}, {invoiceData.clientCity}</div>
            <div>{invoiceData.clientCountry}</div>
          </div>
        </section>

        {/* DUE DATE */}
        {invoiceData.dueDate && (
          <section className="section" style={{ margin: '20px' }}>
            <h3>Due Date: {invoiceData.dueDate}</h3>
          </section>
        )}

        {/* ITEMS */}
        {invoiceData.items.length > 0 && (
          <section className={styles.itemsContainer}>
            <h2>Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price ({invoiceData.currency})</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toFixed(2)}</td>
                    <td>{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* TOTAL */}
        {invoiceData.items.length > 0 && (
          <section className={styles.totalContainer}>
            {(() => {
              const discountAmount = total * (invoiceData.discount ?? 0);
              const finalTotal = total - discountAmount;

              return (
                <table className={styles.itemsTable}>
                  <tbody>
                    <tr className={styles.row}>
                      <td colSpan={3} className={styles.label}>Subtotal</td>
                      <td className={styles.dataOutput}>{total.toFixed(2)} {invoiceData.currency}</td>
                    </tr>
                    <tr className={styles.row}>
                      <td colSpan={3} className={styles.label}>Korting</td>
                      <td className={styles.dataOutput}>- {discountAmount.toFixed(2)} {invoiceData.currency}</td>
                    </tr>
                    <tr className={`${styles.row} ${styles.totalRow}`}>
                      <td colSpan={3} className={styles.label}>Totaal</td>
                      <td className={styles.dataOutput}>{finalTotal.toFixed(2)} {invoiceData.currency}</td>
                    </tr>
                  </tbody>
                </table>
              );
            })()}
          </section>
        )}



        {/* NOTES */}
        {invoiceData.notes && (
          <section className="section" style={{ margin: '20px' }}>
            <h3>Notes</h3>
            <p>{invoiceData.notes}</p>
          </section>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handlePrint}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
