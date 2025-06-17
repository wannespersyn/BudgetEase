
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { TransactionService } from "../../service/transaction-service";

export async function CreateTransactionHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
            context.log(`Http function processed request for url "${request.url}"`);
    
            const body = await request.json() as { userEmail: string, transaction: createTransactionRequestBody };
    
            const transactions = await TransactionService.getInstance().createTransaction(body.transaction, body.userEmail);
    
            return {
                status: 200,
                jsonBody: {
                    message: 'Transaction created successfully',
                    transactions
                }
            };
        }, request, context)
};

app.http('CreateTransactionHttpTrigger', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateTransactionHttpTrigger
});
