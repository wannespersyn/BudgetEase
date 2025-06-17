import { User } from "../domain/user";
import { v4 as uuidv4 } from 'uuid';
import { Container, CosmosClient, RequestOptions } from "@azure/cosmos";
import { Budget } from "../domain/budget";
import { UserService } from "../service/user-service";
import { CustomError } from "../domain/custom-error";

interface CosmosDocument {
    id: string;
    name: string;
    amount: number;
    description: string;
    startDate: Date;
    endDate: Date;
    user: User;
}

export class CosmosBudgetRepository {

    private static instance: CosmosBudgetRepository;

    private toBudget(document: CosmosDocument) {
        if (!document.name || !document.amount || !document.description || !document.startDate || !document.endDate || !document.user) {
            throw new Error("Invalid budget document.");
        }

        return new Budget(
            document.id,
            document.name,
            document.amount,
            document.description,
            document.startDate,
            document.endDate,
            document.user,
        );
    }

    constructor(private readonly container: Container) {
        if (!container) {
            throw new Error("Budget Cosmos DB container is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            
            const connectionString = process.env.COSMOS_CONNECTION_STRING;
            const databaseName = process.env.COSMOS_DATABASE_NAME;
            const containerName = "budgets";
            const partitionKeyPath = ["/partition"];

            if (!connectionString || !databaseName) {
                throw new Error("Cosmos DB budget configuration is missing.");
            }

            const cosmosClient = new CosmosClient(connectionString);

            const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
            const { container } = await database.containers.createIfNotExists({
                id: containerName,
                partitionKey: { paths: partitionKeyPath }
            });

            this.instance = new CosmosBudgetRepository(container);
        }
        return this.instance;
    }

    async createBudget(budget: Budget, email: string): Promise<Budget> {
        const id = uuidv4();
        const user = await UserService.getInstance().getUser(email);

        if (!user) {
            throw CustomError.notFound("User not found.");
        }

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
            name: budget.name,
            amount: budget.amount,
            description: budget.description,
            startDate: budget.startDate,
            endDate: budget.endDate,
            user: plainUser,
        }, options);

        if (result && result.resource) {
            return this.getBudget(id, email);
        } else {
            throw new Error("Could not create budget.");
        }
    }

    async getBudget(id: string, userEmail: string): Promise<Budget> {
        console.log(`Fetching budget with ID: ${id} for user: ${userEmail}`);
        const { resource } = await this.container.item(id, userEmail).read();
        if (resource) {
            return this.toBudget(resource);
        } else {
            throw new Error("Budget not found.");
        }
    }

    async getAllBudgets(userEmail: string): Promise<Budget[]> {
        console.log(`Fetching all budgets for user: ${userEmail}`);
        const querySpec = {
            query: "SELECT * FROM c WHERE c.user.email = @userEmail",
            parameters: [{ name: "@userEmail", value: userEmail }]
        };

        const { resources } = await this.container.items.query<CosmosDocument>(querySpec).fetchAll();
        return resources.map(doc => this.toBudget(doc));
    }
}