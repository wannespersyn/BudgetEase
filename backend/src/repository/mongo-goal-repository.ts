import { Collection, MongoClient, Document, ObjectId } from "mongodb";
import { CustomError } from "../domain/custom-error";
import { Goal } from "../domain/goal";
import { MongoUserRepository } from "./mongo-user-repository";

export class MongoGoalRepository {
    private static instance: MongoGoalRepository;

    private async toGoal(document: Document) {
        if (!document.amount || !document.description || !document.date || !document.user) {
            throw CustomError.internal("Invalid goal document.");
        }

        const user = await (await MongoUserRepository.getInstance()).getUser(document.email);
        
        return new Goal(
            document._id,
            document.name,
            document.description,
            document.targetAmount,
            document.currentAmount,
            document.deadline,
            user.toSimpleUser(),
            []
        );
    }

    constructor(private readonly collection: Collection) {
        if (!collection) {
            throw new Error("Goal collection is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            const mongoClient = new MongoClient(process.env.DB_CONN_STRING || "mongodb://localhost:27017");
            await mongoClient.connect();
            const db = mongoClient.db(process.env.DB_NAME || "ll-db");
            const collection = db.collection(process.env.GOAL_COLLECTION_NAME || "goals");
            this.instance = new MongoGoalRepository(collection);
        }
        return this.instance;
    };

    async createGoal(goal: Goal, userEmail): Promise<Goal> {
        const result = await this.collection.insertOne({
            name: goal.name,
            description: goal.description,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline,
            email: goal.user.email
        });
        if (result && result.acknowledged && result.insertedId) {
            return this.getGoal(goal.id, userEmail);
        } else {
            throw CustomError.internal("Could not create goal.");
        }
    }

    async goalExists(id: string, userEmail): Promise<boolean> {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        return !!result;
    }

    async getGoal(id: string, userEmail: string): Promise<Goal> {
        const result = await this.collection.findOne({ _id: new ObjectId(id), email: userEmail });
        if (result) {
            return this.toGoal(result);
        } else {
            throw CustomError.notFound("Goal not found.");
        }
    }

    async removeGoal(id: string, userEmail: string): Promise<void> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id), email: userEmail });
        if (!result || !result.acknowledged) {
            throw CustomError.internal("Could not remove goal.");
        }
    }
}