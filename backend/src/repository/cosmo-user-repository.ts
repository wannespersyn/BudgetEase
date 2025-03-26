import { User } from "../domain/user";
import { CustomError } from "../domain/custom-error";
import { Container, CosmosClient } from "@azure/cosmos";

interface CosmosDocument {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    roles: ROLES;
    createAt: Date;
    updateAt: Date;
}


export class CosmosUserRepository {

    private static instance: CosmosUserRepository;

    private toUser(document: CosmosDocument) {
        if (!document.username || !document.email || !document.passwordHash || !document.roles) {
            throw CustomError.internal("Invalid user document.");
        }
        
        return new User(
            document.username,
            document.email, 
            document.passwordHash,
            document.roles,
            document.createAt,
            document.updateAt
        );
    }

    constructor(private readonly container: Container) {
        if (!container) {
            throw new Error("User Cosmos DB container is required.");
        }
    }   

    static async getInstance() {
        if (!this.instance) {
            
            const key = process.env.COSMOS_KEY;
            const endpoint = process.env.COSMOS_ENDPOINT;
            const databaseName = process.env.COSMOS_DATABASE_NAME;
            const containerName = "users";
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

            this.instance = new CosmosUserRepository(container);

        }
        return this.instance;
    };

    async createUser(user: User): Promise<User> {
        const result = await this.container.items.create({
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            roles: user.role,
            createAt: user.createdAt,
            updateAt: user.updatedAt,
            partition: user.email.substring(0, 3)
        }); 

        if (result && result.statusCode >= 200 && result.statusCode < 400) {
            return this.getUser(user.email);
        } else {
            throw CustomError.internal("Failed to create user");
        }
    }

    async userExists(email: string): Promise<boolean> {
        const { resource } = await this.container.item(email, email.substring(0, 3)).read();
        return !!resource;
    }

    async getUser(email: string): Promise<User> {
        const { resource } = await this.container.item(email, email.substring(0, 3)).read();
        if (resource) {
            return this.toUser(resource)
        } else {
            throw CustomError.notFound("User not found.");
        }
    }
}