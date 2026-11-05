import { prisma } from '../db/client.js';
import { forms } from '../forms/entities/index.js';
import { resources } from './resources.js';

export function getResource(key) {
  const resource = resources[key];
  const form = forms[key];
  if (!resource || !form) return null;
  return { key, resource, form };
}

export function withDefaults(form, body) {
  const data = { ...body };
  for (const field of form.fields) {
    if (data[field.name] === undefined && field.default !== undefined) {
      data[field.name] = field.default;
    }
  }
  return data;
}

export async function fetchRecord(key, id) {
  const { resource } = getResource(key);
  return prisma[resource.model].findUnique({
    where: { id },
    include: resource.include
  });
}

export function jsonError(res, status, message, errors = null) {
  const payload = { message };
  if (errors) payload.errors = errors;
  return res.status(status).json(payload);
}
