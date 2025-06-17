import { CustomError } from "./custom-error";
import { SimpleUser } from "./user";

export class Transaction {
  constructor(
        readonly id: string, 
        readonly amount: number,
        readonly type: TYPES,
        readonly description: string, 
        readonly date: Date,
        readonly user: SimpleUser
    ) {
    if (!amount || !type || !description || !date || !user) {
      throw CustomError.invalid("Amount, type, description, date and user are required.");
    }
  }
}