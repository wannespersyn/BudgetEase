import { Collection, MongoClient, Document, ObjectId } from "mongodb";
import { MongoUserRepository } from "./mongo-user-repository";
import { CustomError } from "../domain/custom-error";
import { Budget } from "../domain/budget";
import { MongoTransactionRepository } from "./mongo-transaction-repository";

export class MongoBudgetRepository {
    private static instance: MongoBudgetRepository;

    private async toBudget(document: Document) {
        if (!document.amount || !document.type || !document.description || !document.date || !document.user) {
            throw CustomError.internal("Invalid budget document.");
        }

        const user = await (await MongoUserRepository.getInstance()).getUser(document.email);
        const transactions = await (await MongoTransactionRepository.getInstance()).getAllTransactions(document.email);
         
        return new Budget(
            document._id,
            document.name,
            document.amount,
            document.description,
            document.startDate,
            document.endDate,
            user.toSimpleUser(),
            transactions
        );
    }

    constructor(private readonly collection: Collection) {
        if (!collection) {
            throw new Error("Budget collection is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            const mongoClient = new MongoClient(process.env.DB_CONN_STRING || "mongodb://localhost:27017");
            await mongoClient.connect();
            const db = mongoClient.db(process.env.DB_NAME || "ll-db");
            const collection = db.collection(process.env.BUDGET_COLLECTION_NAME || "budgets");
            this.instance = new MongoBudgetRepository(collection);
        }
        return this.instance;
    };

    async createBudget(budget: Budget, userEmail): Promise<Budget> {
        const result = await this.collection.insertOne({
            name: budget.name,
            amount: budget.amount,
            description: budget.description,
            startDate: budget.startDate,
            endDate: budget.endDate,
            email: budget.user.email
        });
        if (result && result.acknowledged && result.insertedId) {
            return this.getBudget(budget.id, userEmail);
        } else {
            throw CustomError.internal("Could not create budget.");
        }
    }

    async getBudget(id: string, userEmail): Promise<Budget> {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        if (result) {
            return this.toBudget(result);
        } else {
            throw CustomError.notFound("Budget not found.");
        }
    }

    async budgetExists(id: string, userEmail): Promise<boolean> {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        return !!result;
    }

    async getAllBudgets(userEmail: string): Promise<Budget[]> {
        const result = await this.collection.find({ email: userEmail }).toArray();
        if (result) {
            return Promise.all(result.map((document: Document) => this.toBudget(document)));
        } else {
            throw CustomError.notFound("Budget not found.");
        }
    }

    async removeBudget(id: string, userEmail: string): Promise<void> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id), email: userEmail });
        if (!result || !result.deletedCount) {
            throw CustomError.notFound("Budget not found.");
        }
    }
}