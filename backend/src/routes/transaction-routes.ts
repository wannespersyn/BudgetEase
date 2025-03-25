import { Request, Response, Express, NextFunction } from "express";
import { authenticatedRoute, wrapRoute } from "./route-factory";
import { Transaction } from "../domain/transaction";
import { TransactionService } from "../service/transaction-service";

export const createTransactionRoutes = (expressApp: Express, transactionService: TransactionService, userService: unknown) => {

    if (!expressApp || !transactionService || !userService) {
        throw new Error("Not all services are initialised. Exiting...");
    }

    expressApp.get('/transactions', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const transactions = await transactionService.getAllTransactions(user);
            res.json(transactions);
        }, next);
    });

    expressApp.get('/transactions/:id', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const transaction = await transactionService.getTransactionById(req.params.id, user);
            res.json(transaction);
        }, next);
    });

    expressApp.post('/transactions', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const transaction = new Transaction(
                    req.body.id,
                    req.body.amount, 
                    req.body.type,
                    req.body.date,
                    req.body.description, 
                    user
                );
            await transactionService.createTransaction(transaction, user.email);
            res.status(201).json(transaction);
        }, next);
    });

}