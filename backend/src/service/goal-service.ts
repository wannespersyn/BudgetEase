import { CustomError } from "../domain/custom-error";
import { CosmosGoalRepository } from "../repository/cosmo-goal-repository";

export class GoalService {

    private async getRepo() {
        return CosmosGoalRepository.getInstance();
    }

    async getGoalById(id: string) {
        return (await this.getRepo()).getGoal(id);
    }

    async createGoal(goal) {
        if (!goal) {
            throw CustomError.invalid("Goal can not be null.");
        }
        await (await this.getRepo()).createGoal(goal);
    }


}