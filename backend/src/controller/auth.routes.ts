import authService from "../services/auth.service";
import express, { Request, Response, NextFunction } from "express";
import { LoginInput, UserInput } from "../types/auth.types";

const AuthRouter = express.Router();

AuthRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <LoginInput>req.body;
        await authService.authenticate(user, res);
    } catch(error) {
        next(error);
    }
})

AuthRouter.post('/logout', async (req: Request, res: Response) => {
    try {
        authService.logout(res);
    } catch(error) {
        res.status(400).json({message: "Error logging out"});
    }
});

AuthRouter.post('/signUp', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const result = await authService.signUp(user);
        res.status(200).json(result);
    } catch(error) {
        next(error);
    }
})

AuthRouter.get('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await authService.getUser(req, res);
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
});




export { AuthRouter };