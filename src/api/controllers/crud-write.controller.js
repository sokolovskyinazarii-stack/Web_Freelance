import { prisma } from '../../db/client.js';
import { validate } from '../../forms/validate.js';
import { localizePrismaError } from '../../lib/prisma-errors.js';
import { fetchRecord, getResource, jsonError, withDefaults } from '../helpers.js';

function validationError(res, errors) {
  return res.status(422).json({ message: 'Помилка валідації', errors });
}

function writeError(res, error, form) {
  const localized = localizePrismaError(error, form);
  const errors = localized.field ? { [localized.field]: localized.message } : undefined;
  return res.status(422).json({ message: localized.message, errors });
}

export async function create(req, res) {
  const target = getResource(req.params.resource);
  if (!target) return jsonError(res, 404, 'Ресурс не знайдено');

  const body = withDefaults(target.form, req.body);
  const { errors, data } = await validate(target.form, body, null);
  if (Object.keys(errors).length) return validationError(res, errors);

  try {
    const created = await prisma[target.resource.model].create({ data });
    return res.status(201).json(await fetchRecord(target.key, created.id));
  } catch (error) {
    return writeError(res, error, target.form);
  }
}

export async function update(req, res) {
  const target = getResource(req.params.resource);
  if (!target) return jsonError(res, 404, 'Ресурс не знайдено');

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return jsonError(res, 404, 'Запис не знайдено');
  }

  const existing = await prisma[target.resource.model].findUnique({ where: { id } });
  if (!existing) return jsonError(res, 404, 'Запис не знайдено');

  const body = req.method === 'PATCH'
    ? { ...existing, ...req.body }
    : withDefaults(target.form, req.body);

  const { errors, data } = await validate(target.form, body, id);
  if (Object.keys(errors).length) return validationError(res, errors);

  try {
    await prisma[target.resource.model].update({ where: { id }, data });
    return res.json(await fetchRecord(target.key, id));
  } catch (error) {
    return writeError(res, error, target.form);
  }
}
