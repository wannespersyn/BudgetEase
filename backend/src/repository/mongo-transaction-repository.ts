import { Collection, MongoClient, Document, ObjectId } from "mongodb";
import { CustomError } from "../domain/custom-error";
import { MongoUserRepository } from "./mongo-user-repository";
import { Transaction } from "../domain/transaction";

export class MongoTransactionRepository {
    private static instance: MongoTransactionRepository;

    private async toTransaction(document: Document) {
        if (!document.amount || !document.type || !document.description || !document.date || !document.user) {
            throw CustomError.internal("Invalid transaction document.");
        }

        const user = await (await MongoUserRepository.getInstance()).getUser(document.email);
         
        return new Transaction(
            document._id,
            document.amount,
            document.type, 
            document.description,
            document.date,
            user.toSimpleUser()
        );
    }

    constructor(private readonly collection: Collection) {
        if (!collection) {
            throw new Error("Transaction collection is required.");
        }
    }

    static async getInstance() {
        if (!this.instance) {
            const mongoClient = new MongoClient(process.env.DB_CONN_STRING || "mongodb://localhost:27017");
            await mongoClient.connect();
            const db = mongoClient.db(process.env.DB_NAME || "ll-db");
            const collection = db.collection(process.env.TRANSACTION_COLLECTION_NAME || "transactions");
            this.instance = new MongoTransactionRepository(collection);
        }
        return this.instance;
    };

    async createTransaction(transaction: Transaction, userEmail): Promise<Transaction> {
        const result = await this.collection.insertOne({
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            date: transaction.date,
            email: transaction.user.email
        });
        if (result && result.acknowledged && result.insertedId) {
            return this.getTransaction(transaction.id, userEmail);
        } else {
            throw CustomError.internal("Could not create transaction.");
        }
    }

    async transactionExists(id: string, userEmail): Promise<boolean> {
        const result = await this.collection.findOne({ _id: new ObjectId(id) });
        return !!result;
    }

    async getTransaction(id: string, userEmail: string): Promise<Transaction> {
        const result = await this.collection.findOne({ _id: new ObjectId(id), email: userEmail });
        if (result) {
                return this.toTransaction(result)
        } else {
            throw CustomError.notFound("Transaction not found.");
        }
    }

    async getAllTransactions(userEmail: string): Promise<Array<Transaction>> {
        const result = await this.collection.find({ email: userEmail }).toArray();
        if (result) {
            return Promise.all(result.map(this.toTransaction));
        } else {
            throw CustomError.notFound("Transaction not found.");
        }
    }

    async removeTransaction(id: string): Promise<boolean> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return !!result && result.acknowledged;
    }
    
}