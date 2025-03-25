import express from 'express'
import cors from 'cors'
import { SimpleUser } from './domain/user';
import { errorHandler } from './routes/route-factory';
import { createUserRoutes } from './routes/user-routes';
import dotenv from 'dotenv';
import { UserService } from './service/user-service';

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    user?: SimpleUser;
  }
}

const app = express()
app.use(cors())
app.use(express.json());

// Init services
const userService = new UserService();

// Create routes
createUserRoutes(app, userService);

// Errorhandler needs to be registered last
app.use(errorHandler);

app.listen(3000, function () {
  console.log("Server listening on port 3000.");
})