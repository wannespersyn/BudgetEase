import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { MongoBudgetRepository } from "../repository/mongo-budget-repository";

export class BudgetService {
    private async getRepo() {
        return MongoBudgetRepository.getInstance();
    }

    async getAllBudgets(user: SimpleUser) {
        return (await this.getRepo()).getAllBudgets(user.email);
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

    async deleteBudgetById(id: string, user: SimpleUser) {
        if (!id || id.length === 0) {
            throw CustomError.invalid("Budget id can not be empty.");
        }

        const foundBudget = await (await this.getRepo()).getBudget(id, user.email);

        if (foundBudget.user.email !== user.email) {
            throw CustomError.unauthorized("This budget belongs to another user.");
        }

        await (await this.getRepo()).removeBudget(id, user.email);
    }
}