import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { GoalService } from "../../service/goal-service";

export async function GetGoalByIdHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
            context.log(`Http function processed request for url "${request.url}"`);
    
            const id = request.query.get('id');
            if (!id) {
                return { status: 400, jsonBody: { error: "Missing id query parameter" } };
            }
    
            const userEmail = request.query.get('email');

            const budget = await GoalService.getInstance().getGoalById(id, userEmail);
    
            return {
                status: 200,
                jsonBody: budget
            };
    }, request, context);
};

app.http('GetGoalByIdHttpTrigger', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetGoalByIdHttpTrigger
});
