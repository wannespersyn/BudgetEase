import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { GoalService } from "../../service/goal-service";

export async function CreateGoalHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
        context.log(`Http function processed request for url "${request.url}"`);

        const body = await request.json() as { userEmail: string, goal: createGoalRequestBody };

        const goal = await GoalService.getInstance().createGoal(body.goal, body.userEmail);

        return {
            status: 200,
            jsonBody: {
                message: 'Goal created successfully',
                goal
            }
        };
    }, request, context)
};

app.http('CreateGoalHttpTrigger', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateGoalHttpTrigger
});
