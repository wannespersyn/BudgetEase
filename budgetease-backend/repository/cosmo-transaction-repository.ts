import { Container, CosmosClient, RequestOptions } from "@azure/cosmos";
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from "../domain/custom-error";
import { Transaction } from "../domain/transaction";
import { User } from "../domain/user";
import { UserService } from "../service/user-service";

interface CosmosDocument {
    id: string;
    amount: number;
    type: TYPES;
    description: string;
    date: Date;
    user: User;
}

export class CosmosTransactionRepository {

    // This is the only place where the CosmosTransactionRepository is instantiated.
    // This is a singleton pattern.
    private static instance: CosmosTransactionRepository;

    // This method is used to convert a Cosmos DB document to a Transaction object.
    private toTransaction(document: CosmosDocument) {
        if (!document.amount || !document.type || !document.description || !document.date || !document.user) {
            throw CustomError.internal("Invalid transaction document.");
        }
        
        return new Transaction(
            document.id,
            document.amount,
            document.type,
            document.description,
            document.date,
            document.user
        );
    }

    // The constructor is private, so it can only be called from within the class.
    // The constructor takes a Cosmos DB container as a parameter.
    constructor(private readonly container: Container) {
        if (!container) {
            throw new Error("Transaction Cosmos DB container is required.");
        }
    }   

    // This is a static method that returns an instance of the CosmosTransactionRepository.
    // If the instance does not exist, it creates a new one.
    static async getInstance() {
        if (!this.instance) {
            
            const connectionString = process.env.COSMOS_CONNECTION_STRING;
            const databaseName = process.env.COSMOS_DATABASE_NAME;
            const containerName = "transactions";
            const partitionKeyPath = ["/partition"];

            if (!connectionString || !databaseName) {
                throw new Error("Cosmos DB transaction configuration is missing.");
            }

            const cosmosClient = new CosmosClient(connectionString);

            const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
            const { container } = await database.containers.createIfNotExists({
                id: containerName,
                partitionKey: { paths: partitionKeyPath }
            });

            this.instance = new CosmosTransactionRepository(container);
        }
        return this.instance;
    };

    /**
     * 
     *  CRUD operations
     * 
     */
    async createTransaction(transaction: Transaction, email: string): Promise<Transaction> {
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
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            date: transaction.date,
            user: plainUser
        }, options);


        if (result && result.resource) {
            return this.getTransaction(id, email);
        } else {
            throw CustomError.internal("Could not create transaction.");
        }
    }

    async getTransaction(id: string, email: string): Promise<Transaction> {
        const result = await this.container.item(id, email).read();

        if (result && result.resource) {
            return this.toTransaction(result.resource);
        } else {
            throw CustomError.notFound("Transaction not found.");
        }
    }

    async getAllTransactions(email: string): Promise<Transaction[]> {
        const querySpec = {
            query: "SELECT * FROM transactions WHERE transactions.user.email = @email",
            parameters: [
                { name: "@email", value: email }
            ]
        };

        const { resources } = await this.container.items.query(querySpec).fetchAll();
        if (resources) {
            return Promise.all(resources.map(this.toTransaction));
        } else {
            throw CustomError.notFound("No transactions found for this account.");
        }
    }

    async removeTransaction(id: string, email: string): Promise<boolean> {
        const { statusCode } = await this.container.item(id, email).delete();
        return statusCode === 204;
    }

    /**
     * 
     * Helper functions
     * 
     */
    async transactionExists(id: string): Promise<boolean> {
        const result = await this.container.item(id).read();
        return !!result.resource;
    }
}