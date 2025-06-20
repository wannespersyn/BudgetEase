import { CustomError } from "../domain/custom-error";
import { compare, hash } from "../domain/hash";
import { User } from "../domain/user";
import { CosmosUserRepository } from "../repository/cosmo-user-repository";

export class UserService {

  private static instance: UserService;

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  private async getRepo() {
    return await CosmosUserRepository.getInstance();
  }

  async addUser( username: string, email: string, password: string, role: ROLES) {
    if (!email || email.length < 3) {
      throw CustomError.invalid('Email is invalid.');
    }

    if (!password || password.length < 8 || password.length > 64) {
      throw CustomError.invalid('Password must be between 8 and 64 characters.');
    }

    if (await (await this.getRepo()).userExists(email)) {
      throw CustomError.conflict('A user with this email address already exists.');
    }

    const user = new User(
      username,
      email, 
      await hash(password),
      role,
      new Date(),
      new Date()
    )
    return (await this.getRepo()).createUser(user);
  }

  async getUser(email: string) {
    if (!email) {
      throw CustomError.invalid('Email is invalid.');
    }

    const result = await (await this.getRepo()).getUser(email);
    console.log(`Fetched user in service: ${JSON.stringify(result)}`);
    return result;
  }

  async loginUser(email: string, password: string) {
    if (!email) {
      throw CustomError.invalid('Email is invalid.');
    }

    const user = await (await this.getRepo()).getUser(email);

    if (!user) {
      throw CustomError.unauthorized('Invalid email or password.');
    }

    const passwordMatch = await compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw CustomError.unauthorized('Invalid email or password.');
    }

    return user;
  }
}
