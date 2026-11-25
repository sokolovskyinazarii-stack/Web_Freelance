import { Router } from 'express';
import passport from 'passport';
import { requireAuth, requireGuest } from '../auth/middleware/index.js';
import {
  logout,
  register,
  showLogin,
  showRegister
} from '../controllers/auth/auth.controller.js';
import { profile } from '../controllers/profile/profile.controller.js';
import {
  changePassword,
  editProfile,
  updateProfile
} from '../controllers/profile/profile-edit.controller.js';

const authRouter = Router();

authRouter.get('/login', requireGuest, showLogin);
authRouter.post('/login', requireGuest, (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return next(error);
    if (!user) return res.redirect(303, '/login?error=1');

    return req.logIn(user, (loginError) => {
      if (loginError) return next(loginError);
      return res.redirect(303, '/');
    });
  })(req, res, next);
});
authRouter.get('/register', requireGuest, showRegister);
authRouter.post('/register', requireGuest, register);
authRouter.post('/logout', requireAuth, logout);
authRouter.get('/profile', requireAuth, profile);
authRouter.get('/profile/edit', requireAuth, editProfile);
authRouter.post('/profile/edit', requireAuth, updateProfile);
authRouter.post('/profile/password', requireAuth, changePassword);

export default authRouter;
