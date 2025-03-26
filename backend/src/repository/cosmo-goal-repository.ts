import { Container, CosmosClient } from "@azure/cosmos";
import { CustomError } from "../domain/custom-error";
import { Goal } from "../domain/goal";
import { Transaction } from "../domain/transaction";
import { User } from "../domain/user";

interface CosmosDocument {
    id: string;
    name: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    user: User;
    transactions: Transaction[];
}

export class CosmosGoalRepository {

    private static instance: CosmosGoalRepository;

    private toGoal(document: CosmosDocument) {
        if (!document.name || !document.description || !document.targetAmount || !document.currentAmount || !document.deadline || !document.user) {
            throw CustomError.internal("Invalid goal document.");
        }
        
        return new Goal(
            document.id,
            document.name,
            document.description,
            document.targetAmount,
            document.currentAmount,
            document.deadline,
            document.user,
            document.transactions
        );
    }

    constructor(private readonly container: Container) {
        if (!container) {
            throw new Error("Goal Cosmos DB container is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            
            const key = process.env.COSMOS_KEY;
            const endpoint = process.env.COSMOS_ENDPOINT;
            const databaseName = process.env.COSMOS_DATABASE_NAME;
            const containerName = "goals";
            const partitionKeyPath = ["/partition"];

            if (!key || !endpoint || !databaseName) {
                throw new Error("Cosmos DB configuration is missing.");
            }

            const cosmosClient = new CosmosClient({ endpoint, key });

            const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
            const { container } = await database.containers.createIfNotExists({
                id: containerName,
                partitionKey: { paths: partitionKeyPath }
            });

            this.instance = new CosmosGoalRepository(container);
        }
        return this.instance;
    };

    /**
     * 
     * CRUD operations
     *  
     */
    async createGoal(goal: Goal): Promise<Goal> {
        const result = await this.container.items.create({
            name: goal.name,
            description: goal.description,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline,
            user: goal.user,
            transactions: goal.transactions
        });
        if (result && result.statusCode >= 200 && result.statusCode < 400) {
            return this.getGoal(result.resource.id);
        } else {
            throw CustomError.internal("Could not create goal.");
        }
    }

    async goalExists(id: string): Promise<boolean> {
        const result = await this.container.item(id).read();
        return !!result;
    }

    async getGoal(id: string): Promise<Goal> {
        const result = await this.container.item(id).read();
        if (result) {
            return this.toGoal(result.resource);
        } else {
            throw CustomError.notFound("Goal not found.");
        }
    }

}
    