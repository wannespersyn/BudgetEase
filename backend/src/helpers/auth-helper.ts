import { HttpRequest } from "@azure/functions";
import { UserService } from "../service/user-service";
import { CustomError } from "../domain/custom-error";

export const validateUser = async (req: HttpRequest) => {
  const authHeader = req.headers['authorization'] || '';
  const b64auth = authHeader.split(' ')[1] || '';
  const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (email && password) {
    try {
      const user = await UserService.getInstance().getUser(email);
      await user.validate(password);
      return user.toSimpleUser();
    } catch (error) {
      throw CustomError.unauthenticated("Not authenticated.");
    }
  } else {
    throw CustomError.unauthenticated("Not authenticated.");
  }
};
