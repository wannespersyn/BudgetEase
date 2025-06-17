import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { TransactionService } from "../../service/transaction-service";
import { UserService } from "../../service/user-service";

export async function DeleteTransactionHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
            context.log(`Http function processed request for url "${request.url}"`);
    
            const body = await request.json() as { email: string, transactionId: string };
            const user = await UserService.getInstance().getUser(body.email);
            const transactionId = body.transactionId;
            console.log(`Deleting transaction with id: ${transactionId} for user: ${user.email}`);
    
            const transactions = await TransactionService.getInstance().deleteTransactionById(transactionId, user);
    
            return {
                status: 200,
                jsonBody: {
                    message: 'Transactions Deleted successfully',
                    transactions
                }
            };
        }, request, context)
};

app.http('DeleteTransactionHttpTrigger', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: DeleteTransactionHttpTrigger
});