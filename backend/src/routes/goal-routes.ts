import { Request, Response, Express, NextFunction } from "express";
import { Goal } from "../domain/goal";
import { authenticatedRoute, wrapRoute } from "./route-factory";
import { GoalService } from "../service/goal-service";

export const createGoalRoutes = (expressApp: Express, goalService: GoalService, userService: unknown) => {

    if (!expressApp || !goalService || !userService) {
        throw new Error("Not all services are initialised. Exiting...");
    }

    expressApp.get('/goals/:id', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const goal = await goalService.getGoalById(req.params.id, user);
            res.json(goal);
        }, next);
    });

    expressApp.post('/goals', authenticatedRoute, (req: Request, res: Response, next: NextFunction) => {
        wrapRoute(async () => {
            const user = req.user;
            const goal = new Goal(
                    req.body.id,
                    req.body.name,
                    req.body.description,
                    req.body.targetAmount, 
                    req.body.currentAmount,
                    req.body.deadline,
                    user,
                    []
                );
            await goalService.createGoal(goal, user.email);
            res.status(201).json(goal);
        }, next);
    });
}