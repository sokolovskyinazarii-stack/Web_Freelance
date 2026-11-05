import { getOverviewData } from '../api/overview.js';
import { buildDashboard } from '../presenters/dashboard.js';
import { buildPublicDashboard } from '../presenters/dashboard-public.js';
import { buildUserDashboard } from '../presenters/dashboard-user.js';
import { getRole } from '../auth/middleware.js';
import { ROLES } from '../auth/roles.js';

export async function dashboardPage(req, res) {
  const role = getRole(req);

  if (role === ROLES.GUEST) {
    const data = await buildPublicDashboard();
    return res.render('dashboard-public.njk', {
      title: 'Огляд',
      active: 'overview',
      ...data
    });
  }

  if (role === ROLES.ADMIN) {
    const data = await getOverviewData();
    return res.render('dashboard.njk', {
      title: 'Огляд',
      active: 'overview',
      ...buildDashboard(data)
    });
  }

  const data = await buildUserDashboard(role, req.user);
  return res.render('dashboard-user.njk', {
    title: 'Огляд',
    active: 'overview',
    ...data
  });
}
