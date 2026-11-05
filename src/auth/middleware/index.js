import { ROLES } from '../roles.js';
import { getNavItems } from '../navigation.js';

export function getRole(req) {
  return req.user?.role?.code || ROLES.GUEST;
}

export function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();

  if (req.originalUrl.startsWith('/api')) {
    return res.status(401).json({ message: 'Потрібна авторизація' });
  }

  return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) return requireAuth(req, res, next);
    if (roles.includes(req.user.role.code)) return next();

    if (req.originalUrl.startsWith('/api')) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    return res.status(403).render('shared/error.njk', {
      title: 'Доступ заборонено',
      message: 'У вас немає прав для перегляду цієї сторінки.',
      active: ''
    });
  };
}

export function requireGuest(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/profile');
  return next();
}

export function authLocals(req, res, next) {
  const role = getRole(req);
  res.locals.currentUser = req.user || null;
  res.locals.currentRole = role;
  res.locals.navItems = getNavItems(role);
  res.locals.canManage = role === ROLES.ADMIN;
  next();
}
