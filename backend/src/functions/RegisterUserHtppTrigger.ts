import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { UserService } from "../service/user-service";
import { CustomError } from "../domain/custom-error";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";

export async function RegisterUserHtppTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return unauthenticatedRouteWrapper(async () => {
        context.log(`Http function processed request for url "${request.url}"`);

        const body = await request.json() as RegisterRequestBody;

        if (!body || !body.username || !body.email || !body.password || !body.role) {
            throw CustomError.invalid('Invalid request body. Please provide username, email, password, and role.');
        }

        const { username, email, password, role } = body;

        await UserService.getInstance().addUser(username, email, password, role);

        return {
            status: 200,
            jsonBody: {
                message: 'User registered successfully',
                user: { username, email, role }
            }
        };
    }, request, context)
};

app.http('RegisterUserHtppTrigger', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: RegisterUserHtppTrigger
});
