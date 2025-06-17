import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { GoalService } from "../../service/goal-service";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";

export async function GetAllGoalsHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
            context.log(`Http function processed request for url "${request.url}"`);
    
            const userEmail = request.query.get('email');
    
            const budgets = await GoalService.getInstance().getAllGoals(userEmail);
    
            return {
                status: 200,
                jsonBody: budgets
            };
    }, request, context);
};

app.http('GetAllGoalsHttpTrigger', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetAllGoalsHttpTrigger
});
