'use client';

import styles from '../../../../styles/Dashboard.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Transaction } from '../../../../types/Transaction';
import Navbar from '../../../../components/navbar';
import TransactionService from '../../../../services/TransactionService';
import BudgetService from '../../../../services/BudgetService';

type type = "INCOME" | "OUTCOME";

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState([]);
    const [Goals, setGoals] = useState([]);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const transactionResponse = await TransactionService.GetTransactions();
            const budgetResponse = await BudgetService.GetBudgets();

            if (!transactionResponse.ok) {
                throw new Error('Failed to fetch transaction data');
            } 

            if (!budgetResponse.ok) {
                throw new Error('Failed to fetch budget data' + budgetResponse.statusText);
            }

            const transactionData = await transactionResponse.json();
            const budgetData = await budgetResponse.json();

            console.log('Transaction data:', transactionData);

            setTransactions(transactionData.transactions);
            setBudgets(budgetData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const totalOutcome = transactions.filter(t => t.type === 'OUTCOME').reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const balance = totalIncome - totalOutcome;

    return (
        <main className={styles.main}>
            <Navbar active='Dashboard' />

            <header className={styles.header}>
                <h1>Welkom terug 👋</h1>
                <p>Hier is een overzicht van je recente transacties en balans.</p>
            </header>

            <section className={styles.cards}>
                <div className={styles.card}>
                <h3>Inkomen</h3>
                <p className={styles.income}>€ {totalIncome.toFixed(2)}</p>
                </div>
                <div className={styles.card}>
                <h3>Uitgaven</h3>
                <p className={styles.outcome}>€ {totalOutcome.toFixed(2)}</p>
                </div>
                <div className={styles.card}>
                <h3>Saldo</h3>
                <p className={balance >= 0 ? styles.income : styles.outcome}>€ {balance.toFixed(2)}</p>
                </div>
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
        </main>
    );
}
