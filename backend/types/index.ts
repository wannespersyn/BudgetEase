type RegisterRequestBody = {
    username: string;
    email: string;
    password: string;
    role: ROLES;
  };

type LoginRequestBody = {
    email: string;
    password: string;
};

type createTransactionRequestBody = {
    amount: number;
    type: TYPES;
    description: string;
    date: Date;
};

type createBudgetRequestBody = {
  name: string;
  amount: number;
  description: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
};

type createGoalRequestBody = {
    name: string;
    description: string;
    targetAmount: number;
    currentAmount?: number; // Optional, defaults to 0
    deadline: Date; // ISO date string
};


  