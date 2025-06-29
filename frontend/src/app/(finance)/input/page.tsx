'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../../styles/TransactionInput.module.css';
import TransactionService from '../../../../services/TransactionService';

export default function TransactionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
    category: '',
    description: '',
    type: 'OUTCOME',
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
    const newValue = type === 'checkbox' && e.target instanceof HTMLInputElement
      ? e.target.checked
      : value;

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
  
    const response = await TransactionService.CreateTransaction(transaction);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Transaction creation failed:', errorData);
      alert('Transaction creation failed. Please try again.');
      return;
    } else {
      console.log('Transaction created successfully');
      alert('Transaction added successfully!');
      router.push('/dashboard.html');
    }
  };

  const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className={styles.labelBlock}>
      {label}
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
            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Transaction Name</span>
              <input type="text" name='name' value={formData.name} onChange={handleChange} className={styles.input} />
            </label>

            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Amount</span>
              <input type="number" name='amount' value={formData.amount} onChange={handleChange} className={styles.input} />
            </label>

            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Date</span>
              <input type="date" name='date' value={formData.date} onChange={handleChange} className={styles.input} />
            </label>

            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Category</span>
              <input type="text" name='category' value={formData.category} onChange={handleChange} className={styles.input} />
            </label>
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

          
            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Transaction Type</span>
              <select className={styles.select} name='type' value={formData.type} onChange={handleChange}>
                <option value="INCOME">Income</option>
                <option value="OUTCOME">Outcome</option>
              </select>
            </label>

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
            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Tags (comma-separated)</span>
              <input type="text" name='tags' value={formData.tags} onChange={handleChange} className={styles.input} />
            </label>

            <Select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="crypto">Crypto</option>
              <option value="other">Other</option>
            </Select>
            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Currency (e.g. EUR)</span>
              <input type="text" name='currency' value={formData.currency} onChange={handleChange} className={styles.input} />
            </label>
            <label className={styles.labelBlock}>
              <span className={styles.labelText}>Attachment URL (optional)</span>
              <input type="text" name='attachmentUrl' value={formData.attachmentUrl} onChange={handleChange} className={styles.input} />
            </label>
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
