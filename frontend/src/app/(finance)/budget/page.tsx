'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/navbar';

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
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Set Budget</h2>

            <input
                type="text"
                name="category"
                placeholder="Category (e.g., Groceries)"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 my-2 border rounded"
                required
            />

            <input
                type="number"
                name="limit"
                placeholder="Limit"
                value={formData.limit}
                onChange={handleChange}
                className="w-full p-2 my-2 border rounded"
                required
            />

            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 my-2 border rounded"
                required
            />

            <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full p-2 my-2 border rounded"
                required
            />

            <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full p-2 my-2 border rounded"
            >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
            </select>

            <label className="block my-2">
                <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="mr-2"
                />
                Recurring Budget
            </label>

            {formData.isRecurring && (
                <select
                name="recurrenceInterval"
                value={formData.recurrenceInterval}
                onChange={handleChange}
                className="w-full p-2 my-2 border rounded"
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
                className="w-full p-2 my-2 border rounded"
            />

            <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
                Save Budget
            </button>
        </form>
    </>
    
  );
}
