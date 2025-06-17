import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TransactionService } from "../../service/transaction-service";
import { UserService } from "../../service/user-service";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";

export async function GetTransactionHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
        context.log(`Http function processed request for url "${request.url}"`);

        const id = request.query.get('id');
        if (!id) {
            return { status: 400, jsonBody: { error: "Missing id query parameter" } };
        }

        const userEmail = request.query.get('email');
        if (!userEmail) {
            return { status: 400, jsonBody: { error: "Missing email query parameter" } };
        }

        const user = await UserService.getInstance().getUser(userEmail);

        const transaction = await TransactionService.getInstance().getTransactionById(id, user);

        return {
                status: 200,
                jsonBody: {
                    message: 'Transaction retrieved successfully',
                    transaction
                }
        };
    }, request, context);
};

app.http('GetTransactionHttpTrigger', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetTransactionHttpTrigger
});


