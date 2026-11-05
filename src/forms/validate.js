import { prisma } from '../db/client.js';

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function normalize(field, raw) {
  if (field.type === 'number') return Number(raw);
  if (field.type === 'date') return new Date(raw);
  if (field.valueType === 'boolean') return raw === 'true';
  if (field.relation) return Number(raw);
  return String(raw).trim();
}

export async function validate(config, raw, id) {
  const errors = {};
  const data = {};

  for (const field of config.fields) {
    const rawValue = raw[field.name] ?? '';

    if (isEmpty(rawValue)) {
      data[field.name] = null;
      if (field.required) {
        errors[field.name] = `Заповніть поле «${field.label}».`;
      }
      continue;
    }

    const value = normalize(field, rawValue);
    data[field.name] = value;

    if (field.type === 'number') {
      if (!Number.isFinite(value)) {
        errors[field.name] = 'Введіть число.';
        continue;
      }
      if (field.min !== undefined && value < field.min) {
        errors[field.name] = `Значення має бути не менше ${field.min}.`;
        continue;
      }
      if (field.max !== undefined && value > field.max) {
        errors[field.name] = `Значення має бути не більше ${field.max}.`;
        continue;
      }
    }

    if (field.type === 'date' && Number.isNaN(value.getTime())) {
      errors[field.name] = 'Введіть коректну дату.';
      continue;
    }

    const text = String(rawValue).trim();

    if (field.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      errors[field.name] = 'Введіть коректну email-адресу.';
      continue;
    }

    if (field.minLength && text.length < field.minLength) {
      errors[field.name] = `Поле «${field.label}» має містити щонайменше ${field.minLength} символів.`;
      continue;
    }

    if (field.maxLength && text.length > field.maxLength) {
      errors[field.name] = `Поле «${field.label}» має містити не більше ${field.maxLength} символів.`;
      continue;
    }

    if (field.pattern && !field.pattern.test(text)) {
      errors[field.name] = `Поле «${field.label}» має неправильний формат.`;
      continue;
    }

    if (
      field.options &&
      !field.options.some((option) => String(option.value) === String(rawValue))
    ) {
      errors[field.name] = `Оберіть коректне значення для поля «${field.label}».`;
      continue;
    }

    if (field.relation) {
      if (!Number.isInteger(value) || value <= 0) {
        errors[field.name] = `Оберіть коректне значення для поля «${field.label}».`;
        continue;
      }

      const related = await prisma[field.relation.model].findUnique({ where: { id: value } });
      if (!related) {
        errors[field.name] = `Оберіть коректне значення для поля «${field.label}».`;
      }
    }
  }

  for (const field of config.fields.filter((item) => item.unique)) {
    if (errors[field.name] || data[field.name] === null || data[field.name] === undefined) {
      continue;
    }

    const where = { [field.name]: data[field.name] };
    if (id) where.id = { not: id };

    const existing = await prisma[config.model].findFirst({ where });
    if (existing) {
      errors[field.name] = `Таке значення поля «${field.label}» вже використовується.`;
    }
  }

  return { errors, data };
}
