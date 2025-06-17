import { CustomError } from "./custom-error";
import { SimpleUser } from "./user";

export class Budget {
    constructor(
            readonly id: string,
            readonly name: string,
            readonly amount: number,
            readonly description: string, 
            readonly startDate: Date,
            readonly endDate: Date,
            readonly user: SimpleUser,
        ) {
        if (!name || !amount || !description || !startDate || !endDate || !user) {
          throw CustomError.invalid("Name, amount, description, startDate, endDate, user and transactions are required.");
        }
    }
}