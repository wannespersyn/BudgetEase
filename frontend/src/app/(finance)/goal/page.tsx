'use client';

import { useState } from 'react';
import styles from '../../../../styles/GoalInput.module.css';
import { useRouter } from 'next/navigation';
import GoalService from '../../../../services/GoalService';

export default function GoalInputPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currentAmount: '',
    targetAmount: '',
    deadline: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { name, description, currentAmount, targetAmount, deadline } = formData;

    // Validatie
    if (!name || !description || !currentAmount || !targetAmount || !deadline) {
      setError('Gelieve alle velden correct in te vullen.');
      return;
    }

    const goal: CreateGoalRequestBody = {
      name,
      description,
      currentAmount: parseFloat(currentAmount),
      targetAmount: parseFloat(targetAmount),
      deadline: new Date(deadline),
    };

    try {
      const response = await GoalService.CreateGoal(goal);
      console.log("Goal", goal)

      if (!response.ok) throw new Error('Fout bij toevoegen van doel.' + response.status + response.statusText);

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError('Er is iets misgegaan bij het opslaan van het doel.');
      console.error('Fout bij het toevoegen van doel:', err);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Nieuw spaardoel</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Naam:
          <input className={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label className={styles.label}>
          Beschrijving:
          <textarea className={styles.textarea} name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <label className={styles.label}>
          Huidig bedrag (€):
          <input className={styles.input} type="number" name="currentAmount" step="0.01" value={formData.currentAmount} onChange={handleChange} required />
        </label>

        <label className={styles.label}>
          Doelbedrag (€):
          <input className={styles.input} type="number" name="targetAmount" step="0.01" value={formData.targetAmount} onChange={handleChange} required />
        </label>

        <label className={styles.label}>
          Deadline:
          <input className={styles.input} type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>🎉 Doel succesvol toegevoegd!</p>}

        <button type="submit" className={styles.button}>Toevoegen</button>
      </form>
    </main>
  );
}
