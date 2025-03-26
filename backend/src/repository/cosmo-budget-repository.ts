import { Transaction } from "../domain/transaction";
import { User } from "../domain/user";
import { Container, CosmosClient } from "@azure/cosmos";
import { Budget } from "../domain/budget";

interface CosmosDocument {
    id: string;
    name: string;
    amount: number;
    description: string;
    startDate: Date;
    endDate: Date;
    user: User;
    transactions: Transaction[];
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
            document.transactions
        );
    }

    constructor(private readonly container: Container) {
        if (!container) {
            throw new Error("Budget Cosmos DB container is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            
            const key = process.env.COSMOS_KEY;
            const endpoint = process.env.COSMOS_ENDPOINT;
            const databaseName = process.env.COSMOS_DATABASE_NAME;
            const containerName = "budgets";
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

            this.instance = new CosmosBudgetRepository(container);
        }
        return this.instance;
    }

    async createBudget(budget: Budget, userEmail): Promise<Budget> {
        const result = await this.container.items.create({
            id: budget.id,
            name: budget.name,
            amount: budget.amount,
            description: budget.description,
            startDate: budget.startDate,
            endDate: budget.endDate,
            user: budget.user,
            transactions: budget.transactions
        });
        if (result && result.resource) {
            return this.getBudget(budget.id, userEmail);
        } else {
            throw new Error("Could not create budget.");
        }
    }

    async getBudget(id: string, userEmail): Promise<Budget> {
        const { resource } = await this.container.item(id, userEmail).read();
        if (resource) {
            return this.toBudget(resource);
        } else {
            throw new Error("Budget not found.");
        }
    }
}