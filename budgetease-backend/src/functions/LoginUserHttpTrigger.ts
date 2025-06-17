import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { unauthenticatedRouteWrapper } from "../../helpers/function-wrapper";
import { CustomError } from "../../domain/custom-error";
import { UserService } from "../../service/user-service";

export async function LoginUserHttpTrigger(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return unauthenticatedRouteWrapper(async () => {
        context.log(`Http function processed request for url "${request.url}"`);

        const body = await request.json() as LoginRequestBody;

        if (!body || !body.email || !body.password) {
            throw CustomError.invalid('Invalid request body. Please provide email and password.');
        }

        const { email, password } = body;

        const user = await UserService.getInstance().loginUser(email, password);

        return {
            status: 200,
            jsonBody: {
                message: 'Login successful',
                user: user.toSimpleUser()
            }
        };
    }, request, context)
};

app.http('LoginUserHttpTrigger', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: LoginUserHttpTrigger
});