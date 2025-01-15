import express from 'express';
import { UserController } from './application/controllers/UserController';
import { UserService } from './infrastructure/services/UserService';
import { errorHandler } from './infrastructure/middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

const userService = new UserService();
const userController = new UserController(userService);

app.use(express.json());

app.get('/users/:id', (req, res, next) => userController.getUserById(req, res, next));

// Global Error Handler (should be added after all routes)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Authentication service running on port ${port}`);
});
