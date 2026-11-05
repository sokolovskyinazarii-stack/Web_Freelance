import { Router } from 'express';
import { editUserForm, listUsers, newUserForm } from '../controllers/users/user.controller.js';
import { createUser } from '../controllers/users/user-create.controller.js';
import { updateUser } from '../controllers/users/user-update.controller.js';
import { resetPassword } from '../controllers/users/user-password.controller.js';

const userRouter = Router();

userRouter.get('/', listUsers);
userRouter.get('/new', newUserForm);
userRouter.post('/', createUser);
userRouter.post('/:id/password', resetPassword);
userRouter.post('/password/:resource/:id', resetPassword);
userRouter.get('/:id/edit', editUserForm);
userRouter.post('/:id', updateUser);

export default userRouter;
