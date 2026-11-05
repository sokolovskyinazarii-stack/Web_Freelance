import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/client.js';

export function configurePassport() {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
            include: { role: true }
          });

          if (!user || !user.isActive) {
            return done(null, false, { message: 'Невірний email або пароль.' });
          }

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) {
            return done(null, false, { message: 'Невірний email або пароль.' });
          }

          const { passwordHash, ...safeUser } = user;
          return done(null, safeUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          isActive: true,
          createdAt: true,
          role: true,
          freelancer: true,
          customer: true,
          courier: true
        }
      });

      if (!user || !user.isActive) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  return passport;
}
