import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CustomError } from "../domain/custom-error";
import { UserService } from "../service/user-service";
import { unauthenticatedRouteWrapper } from "../helpers/function-wrapper";

interface RegisterRequest {
    email: string;
    password: string;
}

const RegisterUserHtttpTrigger = async function (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    let response: HttpResponseInit;

    await unauthenticatedRouteWrapper(async () => {
        context.log('HTTP trigger function processed a request.');

        const body = await request.json() as RegisterRequest;

        if (!body.email || !body.password) {
            throw CustomError.invalid("Missing email or password.");
        }

        await UserService.getInstance().addUser(body.email, body.password, "defaultRole", ROLES.GUEST);

        response = {
            status: 201,
            body: JSON.stringify({ email: body.email }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }, request, context);

    return response!;
};

export default RegisterUserHtttpTrigger;

app.http('RegisterUserHtttpTrigger', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'register',
    handler: RegisterUserHtttpTrigger
});