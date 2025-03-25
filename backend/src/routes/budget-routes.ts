import { Request, Response, Express, NextFunction } from "express";
import { Budget } from "../domain/budget";
import { BudgetService } from "../service/budget-service";
import { authenticatedRoute, wrapRoute } from "./route-factory";

export const createBudgetRoutes = (expressApp: Express, budgetService: BudgetService, userService: unknown) => {

    if (!expressApp || !budgetService || !userService) {
        throw new Error("Not all services are initialised. Exiting...");
    }

    expressApp.get('/budgets', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const budgets = await budgetService.getAllBudgets(user);
            res.json(budgets);
        }, next);
    });

    expressApp.get('/budgets/:id', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const budget = await budgetService.getBudgetById(req.params.id, user);
            res.json(budget);
        }, next);
    });

    expressApp.post('/budgets', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const transactions = req.body.transactions;
            const budget = new Budget(
                    req.body.id,
                    req.body.name,
                    req.body.amount, 
                    req.body.description,
                    req.body.startDate,
                    req.body.endDate,
                    user,
                    transactions
                );
            await budgetService.createBudget(budget, user.email);
            res.status(201).json(budget);
        }, next);
    });
   
}