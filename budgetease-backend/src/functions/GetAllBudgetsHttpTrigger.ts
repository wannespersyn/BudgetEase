import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { BudgetService } from "../../service/budget-service";

export async function GetAllBudgetsHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
        context.log(`Http function processed request for url "${request.url}"`);

        const userEmail = request.query.get('email');

        const budgets = await BudgetService.getInstance().getAllBudgets(userEmail);

        return {
            status: 200,
            jsonBody: budgets
        };
    }, request, context);
};

app.http('GetAllBudgetsHttpTrigger', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetAllBudgetsHttpTrigger
});
