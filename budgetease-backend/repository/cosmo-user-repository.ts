import { User } from "../domain/user";
import { CustomError } from "../domain/custom-error";
import { Container, CosmosClient, RequestOptions } from "@azure/cosmos";



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
            
            const connectionString = process.env.COSMOS_CONNECTION_STRING;
            const databaseName = process.env.COSMOS_DATABASE_NAME;
            const containerName = process.env.COSMOS_CONTAINER_NAME;
            const partitionKeyPath = ["/partition"];

            if (!connectionString || !databaseName) {
                throw new Error("🔥 DEBUG: Cosmos DB user configuration is missing.");
            }

            const cosmosClient = new CosmosClient(connectionString);

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
        const partitionKey = user.email;

        const options: RequestOptions & { partitionKey: string } = {
            partitionKey,
        };

        const result = await this.container.items.create({
            id: user.email,
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            roles: user.role,
            createAt: user.createdAt,
            updateAt: user.updatedAt,
            partition: partitionKey,
        }, options);

        if (result && result.statusCode >= 200 && result.statusCode < 400) {
            console.log("User created successfully:", result.resource);
            return this.toUser(result.resource as CosmosDocument);
        } else {
            throw CustomError.internal("Failed to create user");
        }
    }

    async userExists(email: string): Promise<boolean> {
        const { resource } = await this.container.item(email, email).read();
        return !!resource;
    }

    async getUser(email: string): Promise<User> {
        const { resource } = await this.container.item(email, email).read();
        if (resource) {
            return this.toUser(resource)
        } else {
            throw CustomError.notFound("User not found.");
        }
    }
}