import { getOverviewData } from '../../api/controllers/overview.controller.js';
import { buildDashboard } from '../../presenters/dashboards/dashboard.js';
import { buildPublicDashboard } from '../../presenters/dashboards/dashboard-public.js';
import { buildUserDashboard } from '../../presenters/dashboards/dashboard-user.js';
import { getRole } from '../../auth/middleware/index.js';
import { ROLES } from '../../auth/roles.js';

export async function dashboardPage(req, res) {
  const role = getRole(req);

  if (role === ROLES.GUEST) {
    const data = await buildPublicDashboard();
    return res.render('dashboard/dashboard-public.njk', {
      title: 'Огляд',
      active: 'overview',
      ...data
    });
  }

  if (role === ROLES.ADMIN) {
    const data = await getOverviewData();
    return res.render('dashboard/dashboard.njk', {
      title: 'Огляд',
      active: 'overview',
      ...buildDashboard(data)
    });
  }

  const data = await buildUserDashboard(role, req.user);
  return res.render('dashboard/dashboard-user.njk', {
    title: 'Огляд',
    active: 'overview',
    ...data
  });
}
