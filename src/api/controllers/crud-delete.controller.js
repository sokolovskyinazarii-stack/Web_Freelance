import { prisma } from '../../db/client.js';
import { cascadeDelete, getRelatedInfo, relatedTotal } from '../../services/relations.js';
import { getResource, jsonError } from '../helpers.js';

export async function remove(req, res) {
  const target = getResource(req.params.resource);
  if (!target) return jsonError(res, 404, 'Ресурс не знайдено');

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return jsonError(res, 404, 'Запис не знайдено');
  }

  const existing = await prisma[target.resource.model].findUnique({ where: { id } });
  if (!existing) return jsonError(res, 404, 'Запис не знайдено');

  const related = await getRelatedInfo(target.key, id);
  const total = relatedTotal(related);
  const cascade = req.query.cascade === 'true' || req.body?.cascade === true;

  if (total > 0 && !cascade) {
    return res.status(409).json({
      message: 'Є пов’язані записи. Передайте cascade=true для каскадного видалення.',
      related
    });
  }

  try {
    if (total > 0) {
      await cascadeDelete(target.key, id);
    } else {
      await prisma[target.resource.model].delete({ where: { id } });
    }
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: 'Не вдалося видалити запис' });
  }
}
