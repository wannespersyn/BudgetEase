import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './util/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Verbinding maken met MongoDB
connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to BudgetEase API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
