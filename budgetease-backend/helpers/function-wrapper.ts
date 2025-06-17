import { Context } from "vm";
import { CustomError } from "../domain/custom-error";
import { SimpleUser } from "../domain/user";
import { UserService } from "../service/user-service";
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export enum AuthenticationType {
  Authenticated,
  Unauthenticated,
  Either
}

/**
 * 
 * @description This function is used to wrap a route handler that should be authenticated.
 * 
 * @param handler 
 * @param request 
 * @param context 
 * @returns 
 */
export const authenticatedRouteWrapper = async (
  handler: (user: SimpleUser) => Promise<HttpResponseInit>,
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const b64auth = authHeader.split(' ')[1] || '';
    const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (email && password) {
      const user = await UserService.getInstance().getUser(email);
      await user.validate(password);
      const simpleUser = user.toSimpleUser();
      return await handler(simpleUser);
    } else {
      throw CustomError.unauthenticated("Not authenticated.");
    }
  } catch (error) {
    context.log(`Error: ${error.message ?? error}`);
    return {
      status: error.status ?? 401,
      jsonBody: {
        error: error.message ?? "Unauthorized"
      }
    };
  }
};

/**
 * 
 * @description This function is used to wrap a route handler that should be unauthenticated.
 * 
 * @param handler 
 * @param request 
 * @param context 
 * @returns 
 */
export const unauthenticatedRouteWrapper = async (
  handler: () => Promise<HttpResponseInit>,
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  try {
    const authHeader = request.headers.get('authorization');

    if (authHeader) {
      throw CustomError.authenticated("Must be unauthenticated to perform this action.");
    }

    return await handler();
  } catch (error) {
    context.log(`Error: ${error.message ?? error}`);
    return {
      status: error.status ?? 500,
      jsonBody: {
        error: error.message ?? "Internal server error"
      }
    };
  }
};


export const openRouteWrapper = async (handler: () => Promise<void>, context: Context) => {
  try {
    await handler();
  } catch (error) {
    errorHandler(error, context);
  }
}

const errorHandler = (error: Error | CustomError, context: Context) => {
  if ((error as any).code) {
    const cError = error as CustomError;
    context.res = {
      body: { message: cError.message },
      status: cError.code,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  } else {
    context.res = {
      body: { message: (error as Error).message },
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
}