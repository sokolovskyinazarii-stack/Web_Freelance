import { prisma } from '../db/client.js';
import { resources } from './resources.js';

function sendNotFound(res, message) {
  return res.status(404).json({ message });
}

export async function list(req, res) {
  const resource = resources[req.params.resource];

  if (!resource) {
    return sendNotFound(res, 'Ресурс не знайдено');
  }

  const rows = await prisma[resource.model].findMany({
    include: resource.include,
    orderBy: resource.orderBy
  });

  return res.json(rows);
}

export async function read(req, res) {
  const resource = resources[req.params.resource];

  if (!resource) {
    return sendNotFound(res, 'Ресурс не знайдено');
  }

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return sendNotFound(res, 'Запис не знайдено');
  }

  const row = await prisma[resource.model].findUnique({
    where: { id },
    include: resource.include
  });

  if (!row) {
    return sendNotFound(res, 'Запис не знайдено');
  }

  return res.json(row);
}
