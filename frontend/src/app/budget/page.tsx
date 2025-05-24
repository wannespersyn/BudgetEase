'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar';
import styles from './styles.module.css';

export default function BudgetForm() {
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    startDate: '',
    endDate: '',
    currency: 'EUR',
    isRecurring: false,
    recurrenceInterval: 'monthly',
    notes: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const budget = {
      ...formData,
      limit: parseFloat(formData.limit),
    };

    console.log('Submitting budget:', budget);
    // TODO: Verstuur dit naar je API/Azure Function

    router.push('/dashboard');
  };

  return (
    <>
      <Navbar active="Budget" />
      <form onSubmit={handleSubmit} className={styles.budgetForm}>
        <h2 className={styles.title}>Set Budget</h2>

        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Groceries)"
          value={formData.category}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="number"
          name="limit"
          placeholder="Limit"
          value={formData.limit}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className={styles.input}
        />

        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
            className={styles.checkbox}
          />
          Recurring Budget
        </label>

        {formData.isRecurring && (
          <select
            name="recurrenceInterval"
            value={formData.recurrenceInterval}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        )}

        <textarea
          name="notes"
          placeholder="Additional notes (optional)"
          value={formData.notes}
          onChange={handleChange}
          className={styles.textarea}
        />

        <button type="submit" className={styles.button}>Save Budget</button>
      </form>
    </>
  );
}
