import { HttpRequest, InvocationContext } from '@azure/functions';
import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { UserService } from "../service/user-service";

export enum AuthenticationType {
  Authenticated,
  Unauthenticated,
  Either
}

export const authenticatedRouteWrapper = async (handler: (user: SimpleUser) => Promise<void>, req: HttpRequest, context: InvocationContext) => {
  try {
    const b64auth = (req.headers.get('authorization') || '').split(' ')[1] || '';
    const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (email && password) {
      const user = await UserService.getInstance().getUser(email);
      await user.validate(password);
      const simpleUser = user.toSimpleUser();
      await handler(simpleUser);
    } else {
      throw CustomError.unauthenticated("Not authenticated.");
    }
  } catch (error) {
    return errorHandler(error, context);
  }
};

export const unauthenticatedRouteWrapper = async (handler: () => Promise<void>, req: HttpRequest, context: InvocationContext) => {
  try {
    if (req.headers.get('authorization')) {
      throw CustomError.authenticated("Must be unauthenticated to perform this action.");
    }
    await handler();
  } catch (error) {
    return errorHandler(error, context);
  }
};

export const openRouteWrapper = async (handler: () => Promise<void>, context: InvocationContext) => {
  try {
    await handler();
  } catch (error) {
    return errorHandler(error, context);
  }
};

const errorHandler = (error: Error | CustomError, context: InvocationContext) => {
  if ((error as any).code) {
    const cError = error as CustomError;
    return {
      body: { message: cError.message },
      status: cError.code,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } else {
    return {
      body: { message: (error as Error).message },
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};