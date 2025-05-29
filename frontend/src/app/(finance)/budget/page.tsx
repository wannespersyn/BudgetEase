'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../../styles/Budget.module.css';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    setIsSubmitting(true);

    const budget = {
      ...formData,
      limit: parseFloat(formData.limit),
    };

    try {
      // TODO: Post to your API
      console.log('Submitting budget:', budget);
      setSubmitted(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Budget submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.budgetForm}>
      <h1 className={styles.heading}>Create Budget</h1>

      {/* === Details === */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Details</legend>

        <label className={styles.label}>
          Category
          <input
            type="text"
            name="category"
            placeholder="e.g., Groceries"
            value={formData.category}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Budget Limit
          <input
            type="number"
            name="limit"
            placeholder="Amount"
            value={formData.limit}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Currency
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
        </label>
      </fieldset>

      {/* === Schedule === */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Schedule</legend>

        <label className={styles.label}>
          Start Date
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          End Date
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>
      </fieldset>

      {/* === Options === */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Options</legend>

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
          <label className={styles.label}>
            Recurrence Interval
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
          </label>
        )}
      </fieldset>

      {/* === Notes === */}
      <label className={styles.label}>
        Notes
        <textarea
          name="notes"
          placeholder="Optional notes"
          value={formData.notes}
          onChange={handleChange}
          className={styles.textarea}
        />
      </label>

      {/* === Submit === */}
      <button
        type="submit"
        className={styles.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Budget'}
      </button>

      {submitted && (
        <p className={styles.successMsg}>Budget successfully saved! Redirecting...</p>
      )}
    </form>
  );
}
