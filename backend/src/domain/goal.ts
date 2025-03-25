import { CustomError } from "./custom-error";
import { Transaction } from "./transaction";
import { SimpleUser } from "./user";

export class Goal {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly targetAmount: number,
        readonly currentAmount: number,
        readonly deadline: Date,
        readonly user: SimpleUser,
        readonly transactions: Transaction[]
    ) {
        if (!name || !description || !targetAmount || !currentAmount || !deadline || !user || !transactions) {
            throw CustomError.invalid("Name, description, targetAmount, currentAmount, deadline, user and transactions are required.");
        }
    }
}