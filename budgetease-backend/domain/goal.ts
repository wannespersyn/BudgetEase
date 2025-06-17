import { CustomError } from "./custom-error";
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
    ) {
        if (!name || !description || !targetAmount || !currentAmount || !deadline || !user) {
            throw CustomError.invalid("Name, description, targetAmount, currentAmount, deadline, user and transactions are required.");
        }
    }
}