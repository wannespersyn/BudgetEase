import { Container, CosmosClient, RequestOptions } from "@azure/cosmos";
import { CustomError } from "../domain/custom-error";
import { Goal } from "../domain/goal";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../domain/user";
import { UserService } from "../service/user-service";

interface CosmosDocument {
    id: string;
    name: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    user: User;
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
        );
    }

    constructor(private readonly container: Container) {
        if (!container) {
            throw new Error("Goal Cosmos DB container is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            
            const connectionString = process.env.COSMOS_CONNECTION_STRING;
            const databaseName = process.env.COSMOS_DATABASE_NAME;
            const containerName = "goals";
            const partitionKeyPath = ["/partition"];

            if (!connectionString || !databaseName) {
                throw new Error("Cosmos DB goal configuration is missing.");
            }

            const cosmosClient = new CosmosClient(connectionString);

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
    async createGoal(goal: Goal, email: string): Promise<Goal> {
        const id = uuidv4();
        const user = await UserService.getInstance().getUser(email);

        if (!user) {
            throw CustomError.notFound("User not found.");
        }

        console.log(`Creating goal with id: ${id} for user: ${email}`);

        const plainUser = {
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        const options: RequestOptions & { partitionKey: string } = {
            partitionKey: email,
        };

        const result = await this.container.items.create({
            id: id,
            name: goal.name,
            description: goal.description,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline,
            user: plainUser,
        }, options);

        if (result && result.statusCode >= 200 && result.statusCode < 400) {
            console.log(`Goal created with id: ${id} for user: ${email}`);
            return this.getGoal(id, email);
        } else {
            throw CustomError.internal("Could not create goal.");
        }
    }

    async goalExists(id: string, email: string): Promise<boolean> {
        const result = await this.container.item(id, email).read();
        return !!result;
    }

    async getGoal(id: string, email: string): Promise<Goal> {
        console.log(`Fetching goal with id: ${id} for user: ${email}`);
        const result = await this.container.item(id, email).read();
        if (result) {
            return this.toGoal(result.resource);
        } else {
            throw CustomError.notFound("Goal not found.");
        }
    }

    async getAllGoals(email: string): Promise<Goal[]> {
        if (!email || email.length === 0) {
            throw CustomError.invalid("Email can not be empty.");
        }

        const querySpec = {
            query: "SELECT * FROM c WHERE c.user.email = @userEmail",
            parameters: [
                { name: "@userEmail", value: email }
            ]
        };

        const { resources } = await this.container.items.query<CosmosDocument>(querySpec).fetchAll();
        return resources.map(doc => this.toGoal(doc));
    }


}
    