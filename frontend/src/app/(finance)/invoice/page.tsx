'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../../styles/Invoice.module.css';
import InvoicePreview from '../../../../components/invoiceComponent';

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

export default function InvoiceForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<InvoiceData>({
    organizationName: '',
    organizationEmail: '',
    organizationAddress: '',
    organizationZip: '',
    organizationCity: '',
    organizationCountry: '',

    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientZip: '',
    clientCity: '',
    clientCountry: '',

    invoiceNumber: '',
    date: '',
    dueDate: '',
    currency: 'EUR',
    discount: 0,
    tax: 0,
    notes: '',
    items: [{ description: '', quantity: 1, price: 0 }],
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['discount', 'tax'].includes(name) ? parseFloat(value) : value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'price' ? Number(value) : value,
    };
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () =>
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }],
    }));

  const removeItem = (index: number) =>
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

  const calculateTotal = () =>
    formData.items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invoice = {
      ...formData,
      total: parseFloat(calculateTotal()),
    };

    console.log('Submitting invoice:', invoice);
    router.push('/invoices');
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <main style={{ display: "flex", width: "100%", maxHeight: "100vh" }}>
      <div style={{ width: '50%', borderRight: '1px solid #ccc' }}>
        <InvoicePreview invoiceData={formData} />
      </div>

      <form onSubmit={handleSubmit} className={styles.invoiceForm}>
        <h2 className={styles.title}>Create Invoice (Step {step}/3)</h2>

        {step === 1 && (
          <>
            <h3 className={styles.subtitle}>1. Organization Info</h3>
            <input name="organizationName" placeholder="Organization Name" value={formData.organizationName} onChange={handleFormChange} required className={styles.input} />
            <input name="organizationEmail" placeholder="Organization Email" value={formData.organizationEmail} onChange={handleFormChange} required className={styles.input} />
            <input name="organizationAddress" placeholder="Address" value={formData.organizationAddress} onChange={handleFormChange} required className={styles.input} />
            <input name="organizationZip" placeholder="Zip Code" value={formData.organizationZip} onChange={handleFormChange} required className={styles.input} />
            <input name="organizationCity" placeholder="City" value={formData.organizationCity} onChange={handleFormChange} required className={styles.input} />
            <input name="organizationCountry" placeholder="Country" value={formData.organizationCountry} onChange={handleFormChange} required className={styles.input} />
          </>
        )}

        {step === 2 && (
          <>
            <h3 className={styles.subtitle}>2. Client Info</h3>
            <input name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleFormChange} required className={styles.input} />
            <input name="clientEmail" placeholder="Client Email" value={formData.clientEmail} onChange={handleFormChange} required className={styles.input} />
            <input name="clientAddress" placeholder="Client Address" value={formData.clientAddress} onChange={handleFormChange} required className={styles.input} />
            <input name="clientZip" placeholder="Client Zip Code" value={formData.clientZip} onChange={handleFormChange} required className={styles.input} />
            <input name="clientCity" placeholder="Client City" value={formData.clientCity} onChange={handleFormChange} required className={styles.input} />
            <input name="clientCountry" placeholder="Client Country" value={formData.clientCountry} onChange={handleFormChange} required className={styles.input} />
          </>
        )}

        {step === 3 && (
          <>
            <h3 className={styles.subtitle}>3. Invoice Details</h3>
            <input name="invoiceNumber" placeholder="Invoice Number" value={formData.invoiceNumber} onChange={handleFormChange} required className={styles.input} />
            <input type="date" name="date" value={formData.date} onChange={handleFormChange} required className={styles.input} />
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleFormChange} required className={styles.input} />
            <select name="currency" value={formData.currency} onChange={handleFormChange} className={styles.select}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>

            <input type="number" name="discount" placeholder="Discount (%)" value={formData.discount} onChange={handleFormChange} className={styles.input} />
            <input type="number" name="tax" placeholder="Tax (%)" value={formData.tax} onChange={handleFormChange} className={styles.input} />

            <h4 className={styles.subtitle}>Items</h4>
            {formData.items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className={styles.input} required />
                <input type="number" placeholder="Qty" value={item.quantity} min={1} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={styles.inputSmall} required />
                <input type="number" placeholder="Price" value={item.price} min={0} step="0.01" onChange={e => handleItemChange(index, 'price', e.target.value)} className={styles.inputSmall} required />
                {formData.items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className={styles.removeButton}>&times;</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem} className={styles.addButton}>+ Add Item</button>

            <p className={styles.total}>Total: {formData.currency} {calculateTotal()}</p>

            <textarea name="notes" placeholder="Additional notes" value={formData.notes} onChange={handleFormChange} className={styles.textarea} />
          </>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          {step > 1 && (
            <button type="button" onClick={prevStep} className={styles.button}>Back</button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep} className={styles.button}>Next</button>
          ) : (
            <button type="submit" className={styles.button}>Send Invoice</button>
          )}
        </div>
      </form>
    </main>
  );
}
