import { prisma } from '../db/client.js';
import { resources } from './resources.js';
import { getRelatedInfo, relatedTotal } from '../services/relations.js';

export async function related(req, res) {
  const resource = resources[req.params.resource];
  const id = Number(req.params.id);

  if (!resource || !Number.isInteger(id)) {
    return res.status(404).json({ message: 'Запис не знайдено' });
  }

  const record = await prisma[resource.model].findUnique({ where: { id } });

  if (!record) {
    return res.status(404).json({ message: 'Запис не знайдено' });
  }

  const items = await getRelatedInfo(req.params.resource, id);

  return res.json({ related: items, total: relatedTotal(items) });
}
