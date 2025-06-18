'use client';

import styles from '../../../../styles/Dashboard.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Transaction } from '../../../../types/Transaction';
import TransactionService from '../../../../services/TransactionService';
import BudgetService from '../../../../services/BudgetService';
import GoalService from '../../../../services/GoalService';

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<BudgetResponse[]>([]);
    const [goals, setGoals] = useState<GoalReponse[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const [transactionRes, budgetRes, goalRes] = await Promise.all([
                    TransactionService.GetTransactions(),
                    BudgetService.GetBudgets(),
                    GoalService.GetGoals()
                ]);

                if (!transactionRes.ok || !budgetRes.ok || !goalRes.ok) {
                    throw new Error("Eén of meerdere fetch-aanvragen zijn mislukt");
                }

                const [transactionData, budgetData, goalData] = await Promise.all([
                    transactionRes.json(),
                    budgetRes.json(),
                    goalRes.json()
                ]);

                console.log('Transacties:', transactionData);
                console.log('Budgetten:', budgetData); 
                console.log('Doelen:', goalData);

                setTransactions(transactionData.transactions);
                setBudgets(budgetData);
                setGoals(goalData);

                console.log(budgets, goals, transactions);
            } catch (error) {
                console.error('Fout bij het ophalen van gegevens:', error);
            }
        })();
    }, []);

    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalOutcome = transactions
        .filter(t => t.type === 'OUTCOME')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = totalIncome - totalOutcome;

    return (
        <main className={styles.main}>

            <header className={styles.header}>
                <h1>Welkom terug 👋</h1>
                <p>Bekijk hieronder je financiële overzicht.</p>
            </header>

            <section className={styles.cards}>
                <Card title="Inkomen" amount={totalIncome} type="INCOME" />
                <Card title="Uitgaven" amount={totalOutcome} type="OUTCOME" />
                <Card title="Saldo" amount={balance} type={balance >= 0 ? "INCOME" : "OUTCOME"} />
            </section>

            <section className={styles.transactionSection}>
                <div className={styles.transactionHeader}>
                    <h2>Recente transacties</h2>
                    <Link href="/input" className={styles.addButton}>+ Nieuwe transactie</Link>
                </div>
                <ul className={styles.transactionList}>
                    {transactions.map(t => (
                        <li key={t.id} className={styles.transactionItem}>
                            <span className={styles.transactionName}>{t.description}</span>
                            <span className={t.type === 'INCOME' ? styles.income : styles.outcome}>
                                € {Math.abs(t.amount).toFixed(2)}
                            </span>
                            <span className={styles.transactionDate}>{t.date}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {budgets.length > 0 && (
                <section className={styles.budgetSection}>
                    <h2>Budgetten</h2>
                    <ul className={styles.budgetList}>
                        {budgets.map(budget => {
                            const spent = transactions
                                .filter(t => t.category === budget.name && t.type === 'OUTCOME')
                                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                            const percentage = Math.min((spent / budget.amount) * 100, 100);

                            return (
                                <li key={budget.id} className={styles.budgetItem}>
                                    <strong>{budget.name}</strong>
                                    <div className={styles.budgetProgress}>
                                        <div className={styles.budgetFill} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <p>€ {spent.toFixed(2)} van € {budget.amount.toFixed(2)}</p>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            {goals.length > 0 && (
                <section className={styles.goalSection}>
                    <h2>Spaardoelen</h2>
                    <ul className={styles.goalList}>
                        {goals.map(goal => {
                            const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                            return (
                                <li key={goal.id} className={styles.goalItem}>
                                    <strong>{goal.name}</strong>
                                    <div className={styles.goalProgress}>
                                        <div className={styles.goalFill} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <p>€ {goal.currentAmount.toFixed(2)} van € {goal.targetAmount.toFixed(2)}</p>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}
        </main>
    );
}

function Card({ title, amount, type }: Readonly<{ title: string, amount: number, type: "INCOME" | "OUTCOME" }>) {
    return (
        <div className={styles.card}>
            <h3>{title}</h3>
            <p className={type === "INCOME" ? styles.income : styles.outcome}>
                € {amount.toFixed(2)}
            </p>
        </div>
    );
}
