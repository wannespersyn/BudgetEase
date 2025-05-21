import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { TransactionService } from "../service/transaction-service";
import { UserService } from "../service/user-service";

export async function GetAllTransactionsHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
        context.log(`Http function processed request for url "${request.url}"`);

        const userEmail = await request.json() as string;
        const user = await UserService.getInstance().getUser(userEmail);

        const transactions = await TransactionService.getInstance().getAllTransactions(user);

        return {
            status: 200,
            jsonBody: {
                message: 'Transactions retrieved successfully',
                transactions
            }
        };
    }, request, context)
};

app.http('GetAllTransactionsHttpTrigger', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetAllTransactionsHttpTrigger
});
