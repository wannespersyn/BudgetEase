import { CustomError } from "./custom-error";
import { compare } from "./hash";

export class User {
  constructor(
        readonly username: string,
        readonly email: string, 
        readonly passwordHash: string,
        readonly role: ROLES,
        readonly createdAt: Date,
        readonly updatedAt: Date
    ) {
    if (!email || !passwordHash || !role || !createdAt || !updatedAt) {
      throw CustomError.invalid("Email, password, role, createdAt and updatedAt are required.");
    }
  }

  async validate(password: string) {
    if (!password) {
      throw CustomError.unauthenticated("Password is invalid.");
    }

    if (!(await compare(password, this.passwordHash))) {
      throw CustomError.unauthenticated("Password is invalid.");
    }
  }

  toSimpleUser() {
    return new SimpleUser(this.email);
  }
}

export class SimpleUser {
  constructor(readonly email: string) { }
}