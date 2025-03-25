import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { MongoGoalRepository } from "../repository/mongo-goal-repository";

export class GoalService {

    private async getRepo() {
        return MongoGoalRepository.getInstance();
    }

    async getGoalById(id: string, user: SimpleUser) {
        return (await this.getRepo()).getGoal(id, user.email);
    }

    async createGoal(goal, userEmail: string) {
        if (!goal) {
            throw CustomError.invalid("Goal can not be null.");
        }
        await (await this.getRepo()).createGoal(goal, userEmail);
    }

    async deleteGoalById(id: string, user: SimpleUser) {
        if (!id || id.length === 0) {
            throw CustomError.invalid("Goal id can not be empty.");
        }

        const foundGoal = await (await this.getRepo()).getGoal(id, user.email);

        if (foundGoal.user.email !== user.email) {
            throw CustomError.unauthorized("This goal belongs to another user.");
        }

        await (await this.getRepo()).removeGoal(id, user.email);
    }


}