'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/navbar';
import styles from '../../../../styles/TransactionInput.module.css';

export default function TransactionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
    category: '',
    description: '',
    type: 'outcome',
    isRecurring: false,
    recurrenceInterval: 'monthly',
    tags: '',
    paymentMethod: 'card',
    currency: 'EUR',
    attachmentUrl: '',
    status: 'completed',
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    console.log('Submitting transaction:', transaction);
    // TODO: Send to API
    router.push('/dashboard');
  };

  const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className={styles.labelBlock}>
      <span className={styles.labelText}>{label}</span>
      <input {...props} className={styles.input} />
    </label>
  );

  const Select = ({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <label className={styles.labelBlock}>
      <span className={styles.labelText}>{label}</span>
      <select {...props} className={styles.select}>
        {children}
      </select>
    </label>
  );

  const StepButtons = () => (
    <div className={styles.stepButtons}>
      {step > 1 && <button type="button" onClick={prevStep} className={styles.secondaryButton}>Back</button>}
      {step < 3 && <button type="button" onClick={nextStep} className={styles.primaryButton}>Next</button>}
      {step === 3 && <button type="submit" className={styles.submitButton}>Add Transaction</button>}
    </div>
  );

  return (
    <main className={styles.main}>
      
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2 className={styles.heading}>Add Transaction – Step {step} of 3</h2>

        {step === 1 && (
          <>
            <Input label="Transaction Name" name="name" type="text" value={formData.name} onChange={handleChange} />
            <Input label="Amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} />
            <Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />
            <Input label="Category" name="category" type="text" value={formData.category} onChange={handleChange} />
          </>
        )}

        {step === 2 && (
          <>
            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
              />
            </label>

            <Select label="Transaction Type" name="type" value={formData.type} onChange={handleChange}>
              <option value="income">Income</option>
              <option value="outcome">Outcome</option>
            </Select>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
              />
              <span className={styles.checkboxText}>Recurring Transaction</span>
            </label>

            {formData.isRecurring && (
              <Select label="Recurrence Interval" name="recurrenceInterval" value={formData.recurrenceInterval} onChange={handleChange}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Input label="Tags (comma-separated)" name="tags" type="text" value={formData.tags} onChange={handleChange} />
            <Select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="crypto">Crypto</option>
              <option value="other">Other</option>
            </Select>
            <Input label="Currency (e.g. EUR)" name="currency" type="text" value={formData.currency} onChange={handleChange} />
            <Input label="Attachment URL (optional)" name="attachmentUrl" type="text" value={formData.attachmentUrl} onChange={handleChange} />
            <Select label="Status" name="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </Select>
          </>
        )}

        <StepButtons />
      </form>
    </main>
  );
}
