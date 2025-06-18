type CreateGoalRequestBody = {
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
};

type GoalReponse = {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
};