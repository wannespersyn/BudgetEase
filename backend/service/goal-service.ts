import { CustomError } from "../domain/custom-error";
import { CosmosGoalRepository } from "../repository/cosmo-goal-repository";

export class GoalService {

    private static instance: GoalService;

    static getInstance() {
        if (!this.instance) {
            this.instance = new GoalService();
        }
        return this.instance;
    }

    private async getRepo() {
        return CosmosGoalRepository.getInstance();
    }

    async getGoalById(id: string, email: string) {
        return (await this.getRepo()).getGoal(id, email);
    }

    async getAllGoals(email: string) {
        if (!email || email.length === 0) {
            throw CustomError.invalid("Email can not be empty.");
        }
        return (await this.getRepo()).getAllGoals(email);
    }

    async createGoal(goal, email: string) {
        if (!goal) {
            throw CustomError.invalid("Goal can not be null.");
        }
        await (await this.getRepo()).createGoal(goal, email);
    }


}