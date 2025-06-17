import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { CosmosBudgetRepository } from "../repository/cosmo-budget-repository";

export class BudgetService {

    private static instance: BudgetService;

    static getInstance() {
        if (!this.instance) {
            this.instance = new BudgetService();
        }
        return this.instance;
    }

    private async getRepo() {
        return CosmosBudgetRepository.getInstance();
    }


    /**
     * 
     * CRUD operations 
     * 
     */
    async getBudgetById(id: string, user: SimpleUser) {
        if (!id || id.length === 0) {
            throw CustomError.invalid("Budget id can not be empty.");
        } else if (!user) {
            throw CustomError.unauthenticated("User is not authenticated.");
        }
        return (await this.getRepo()).getBudget(id, user.email);
    }

    async getAllBudgets(userEmail: string) {
        if (!userEmail || userEmail.length === 0) {
            throw CustomError.invalid("User email can not be empty.");
        }
        return (await this.getRepo()).getAllBudgets(userEmail);
    }

    async createBudget(budget, userEmail: string) {
        if (!budget) {
            throw CustomError.invalid("Budget can not be null.");
        }
        await (await this.getRepo()).createBudget(budget, userEmail);
    }

}