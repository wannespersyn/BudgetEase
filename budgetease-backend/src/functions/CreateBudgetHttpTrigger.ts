import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { authenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { BudgetService } from "../../service/budget-service";

export async function CreateBudgetHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return authenticatedRouteWrapper(async () => {
            context.log(`Http function processed request for url "${request.url}"`);
            
            const body = await request.json() as { userEmail: string, budget: createBudgetRequestBody };
            console.log("BODY:", JSON.stringify(body)); // debug

            if (typeof body.userEmail !== 'string') {
                throw new Error("Invalid input: userEmail is not a string");
            }


            const Createdbudget = await BudgetService.getInstance().createBudget(body.budget, body.userEmail);
        
            
            return {
                status: 200,
                jsonBody: {
                    message: 'Budget created successfully',
                    Createdbudget
                }
            };
        }, request, context)
};

app.http('CreateBudgetHttpTrigger', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: CreateBudgetHttpTrigger
});
