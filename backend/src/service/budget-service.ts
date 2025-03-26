import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { CosmosBudgetRepository } from "../repository/cosmo-budget-repository";

export class BudgetService {
    private async getRepo() {
        return CosmosBudgetRepository.getInstance();
    }

    async getBudgetById(id: string, user: SimpleUser) {
        if (!id || id.length === 0) {
            throw CustomError.invalid("Budget id can not be empty.");
        } else if (!user) {
            throw CustomError.unauthenticated("User is not authenticated.");
        }
        return (await this.getRepo()).getBudget(id, user.email);
    }

    async createBudget(budget, userEmail: string) {
        if (!budget) {
            throw CustomError.invalid("Budget can not be null.");
        }
        await (await this.getRepo()).createBudget(budget, userEmail);
    }

}