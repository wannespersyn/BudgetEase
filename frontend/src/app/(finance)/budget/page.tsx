'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/navbar';
import '../../../../styles/budget.css';

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
      <form onSubmit={handleSubmit} className="budget-form">
        <h2>Set Budget</h2>

        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Groceries)"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="limit"
          placeholder="Limit"
          value={formData.limit}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />

        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleChange}
          />
          Recurring Budget
        </label>

        {formData.isRecurring && (
          <select
            name="recurrenceInterval"
            value={formData.recurrenceInterval}
            onChange={handleChange}
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
        />

        <button type="submit">Save Budget</button>
      </form>
    </>
  );
}
