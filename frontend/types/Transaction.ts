export type Transaction = {
    id?: string;
    userId: string;
    name: string;
    amount: number;
    date: string;
    category: string;
    description?: string;
    type: "income" | "outcome";
    isRecurring?: boolean;
    recurrenceInterval?: "weekly" | "monthly" | "yearly";
    tags?: string[];
    paymentMethod?: "cash" | "card" | "bank transfer" | "crypto" | "other";
    currency?: string;
    attachmentUrl?: string;
    status?: "pending" | "completed" | "failed";
};