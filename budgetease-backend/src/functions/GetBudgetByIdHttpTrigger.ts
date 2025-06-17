import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BudgetService } from "../../service/budget-service";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { UserService } from "../../service/user-service";

export async function GetBudgetByIdHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const budget = await BudgetService.getInstance().getBudgetById(id, user);

        return {
            status: 200,
            jsonBody: budget
        };
    }, request, context);
};

app.http('GetBudgetByIdHttpTrigger', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetBudgetByIdHttpTrigger
});


