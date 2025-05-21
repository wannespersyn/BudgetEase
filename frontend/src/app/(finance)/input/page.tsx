'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/navbar';

export default function TransactionForm() {
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
  
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
  
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    console.log('Submitting transaction:', transaction);

    // TODO: POST to Azure Function

    router.push('/dashboard');
  };

  const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className="block my-2">
      <span className="text-sm text-gray-700">{label}</span>
      <input {...props} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </label>
  );

  const Select = ({ label, children, ...props }: { label: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <label className="block my-2">
      <span className="text-sm text-gray-700">{label}</span>
      <select {...props} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
        {children}
      </select>
    </label>
  );

  return (
    <>
      <Navbar active="Input" />
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Add Transaction</h2>

        <Input label="Transaction Name" name="name" type="text" value={formData.name} onChange={handleChange} />
        <Input label="Amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} />
        <Input label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />
        <Input label="Category" name="category" type="text" value={formData.category} onChange={handleChange} />

        <label className="block my-2">
          <span className="text-sm text-gray-700">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <Select label="Transaction Type" name="type" value={formData.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="outcome">Outcome</option>
        </Select>

        <label className="flex items-center gap-2 my-2">
          <input type="checkbox" name="isRecurring" checked={formData.isRecurring} onChange={handleChange} />
          <span className="text-sm text-gray-700">Recurring Transaction</span>
        </label>

        {formData.isRecurring && (
          <Select label="Recurrence Interval" name="recurrenceInterval" value={formData.recurrenceInterval} onChange={handleChange}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        )}

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

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Add Transaction
        </button>
      </form>
    
    </>
  
  );
}
