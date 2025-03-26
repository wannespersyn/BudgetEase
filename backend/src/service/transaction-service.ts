import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { CosmosTransactionRepository } from "../repository/cosmo-transaction-repository";


export class TransactionService {

    private async getRepo() {
        return CosmosTransactionRepository.getInstance();
    }

    /**
     * 
     * CRUD operations 
     * 
     */
    async getAllTransactions(user: SimpleUser) {
        return (await this.getRepo()).getAllTransactions(user.email);
    }

    async getTransactionById(id: string, user: SimpleUser) {
        if (!id || id.length === 0) {
            throw CustomError.invalid("Transaction id can not be empty.");
        } else if (!user) {
            throw CustomError.unauthenticated("User is not authenticated.");
        }
        return (await this.getRepo()).getTransaction(id, user.email);
    }

    async createTransaction(transaction, userEmail: string) {
        if (!transaction) {
            throw CustomError.invalid("Transaction can not be null.");
        }
        await (await this.getRepo()).createTransaction(transaction, userEmail);
    }

    
    async deleteTransactionById(id: string, user: SimpleUser) {
        if (!id || id.length === 0) {
            throw CustomError.invalid("Transaction id can not be empty.");
        }

        const foundTransaction = await (await this.getRepo()).getTransaction(id, user.email);

        if (foundTransaction.user.email !== user.email) {
            throw CustomError.unauthorized("This transaction belongs to another user.");
        }

        await (await this.getRepo()).removeTransaction(id);
    }
}