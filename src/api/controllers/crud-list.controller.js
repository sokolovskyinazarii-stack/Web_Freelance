import { prisma } from '../../db/client.js';
import { getResource, jsonError } from '../helpers.js';

export async function list(req, res) {
  const target = getResource(req.params.resource);
  if (!target) return jsonError(res, 404, 'Ресурс не знайдено');

  const query = {
    include: target.resource.include,
    orderBy: target.resource.orderBy
  };

  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);
  if (Number.isInteger(limit) && limit > 0) query.take = Math.min(limit, 100);
  if (Number.isInteger(offset) && offset >= 0) query.skip = offset;

  const rows = await prisma[target.resource.model].findMany(query);
  return res.json(rows);
}

export async function read(req, res) {
  const target = getResource(req.params.resource);
  if (!target) return jsonError(res, 404, 'Ресурс не знайдено');

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return jsonError(res, 404, 'Запис не знайдено');
  }

  const row = await prisma[target.resource.model].findUnique({
    where: { id },
    include: target.resource.include
  });

  if (!row) return jsonError(res, 404, 'Запис не знайдено');
  return res.json(row);
}
