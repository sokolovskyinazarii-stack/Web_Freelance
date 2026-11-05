import { Router } from 'express';
import { editUserForm, listUsers, newUserForm } from '../controllers/user.controller.js';
import { createUser } from '../controllers/user-create.controller.js';
import { updateUser } from '../controllers/user-update.controller.js';
import { resetPassword } from '../controllers/user-password.controller.js';

const userRouter = Router();

userRouter.get('/', listUsers);
userRouter.get('/new', newUserForm);
userRouter.post('/', createUser);
userRouter.post('/:id/password', resetPassword);
userRouter.post('/password/:resource/:id', resetPassword);
userRouter.get('/:id/edit', editUserForm);
userRouter.post('/:id', updateUser);

export default userRouter;
