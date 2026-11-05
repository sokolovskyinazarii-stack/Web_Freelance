import { prisma } from '../db/client.js';
import { forms } from './entities/index.js';

function toDateInput(value) {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

function fieldValue(field, record) {
  if (!record) {
    return field.default !== undefined ? String(field.default) : '';
  }

  const value = record[field.name];

  if (field.type === 'date') return toDateInput(value);
  if (field.valueType === 'boolean') return String(Boolean(value));
  return value === null || value === undefined ? '' : String(value);
}

async function buildFields(config, record) {
  const fields = [];

  for (const field of config.fields) {
    const item = { ...field, value: fieldValue(field, record) };

    if (field.relation) {
      const rows = await prisma[field.relation.model].findMany({
        include: field.relation.include,
        orderBy: field.relation.orderBy
      });
      const filtered = field.relation.filter
        ? rows.filter((row) => field.relation.filter(row, record))
        : rows;

      item.options = filtered.map((row) => ({
        value: String(row.id),
        label: field.relation.optionLabel(row)
      }));
    }

    fields.push(item);
  }

  return fields;
}

export async function renderFormPage(req, res, key, record, errors = {}, values = null, status = 200) {
  const config = forms[key];
  const fields = await buildFields(config, record);
  const prepared = fields.map((field) => ({
    ...field,
    value: values ? String(values[field.name] ?? '') : field.value
  }));

  res.status(status).render('form.njk', {
    title: record ? config.editTitle : config.createTitle,
    active: key,
    config,
    fields: prepared,
    errors,
    action: record ? `/${key}/${record.id}` : `/${key}`,
    cancelHref: record ? `/${key}/${record.id}` : `/${key}`,
    submitLabel: record ? 'Зберегти зміни' : 'Створити'
  });
}
