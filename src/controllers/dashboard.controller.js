import { getOverviewData } from '../api/overview.js';
import { buildDashboard } from '../presenters/dashboard.js';

export async function dashboardPage(req, res) {
  const data = await getOverviewData();

  res.render('dashboard.njk', {
    title: 'Огляд',
    active: 'overview',
    ...buildDashboard(data)
  });
}
