import { prisma } from '../../db/client.js';
import { forms } from '../../forms/entities/index.js';
import { validate } from '../../forms/validate.js';
import { renderFormPage } from '../../forms/form-view.js';
import { localizePrismaError } from '../../lib/prisma-errors.js';
import { cascadeDelete, getRelatedInfo, relatedTotal } from '../../services/relations.js';

function notFound(res, active) {
  return res.status(404).render('shared/error.njk', {
    title: 'Запис не знайдено',
    message: 'Можливо, запис видалено або вказано неправильний ідентифікатор.',
    active
  });
}

export function newForm(key) {
  return async (req, res) => renderFormPage(req, res, key, null);
}

export function editForm(key) {
  return async (req, res) => {
    const config = forms[key];
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) return notFound(res, key);

    const record = await prisma[config.model].findUnique({ where: { id } });
    if (!record) return notFound(res, key);

    return renderFormPage(req, res, key, record);
  };
}

export function createRecord(key) {
  return async (req, res) => {
    const config = forms[key];

    try {
      const { errors, data } = await validate(config, req.body, null);

      if (Object.keys(errors).length) {
        return renderFormPage(req, res, key, null, errors, req.body, 422);
      }

      const created = await prisma[config.model].create({ data });
      return res.redirect(`/${key}/${created.id}?created=1`);
    } catch (error) {
      const localized = localizePrismaError(error, config);
      const errors = { _form: localized.message };
      if (localized.field) errors[localized.field] = localized.message;
      return renderFormPage(req, res, key, null, errors, req.body, 422);
    }
  };
}

export function updateRecord(key) {
  return async (req, res) => {
    const config = forms[key];
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) return notFound(res, key);

    const record = await prisma[config.model].findUnique({ where: { id } });
    if (!record) return notFound(res, key);

    try {
      const { errors, data } = await validate(config, req.body, id);

      if (Object.keys(errors).length) {
        return renderFormPage(req, res, key, record, errors, req.body, 422);
      }

      await prisma[config.model].update({ where: { id }, data });
      return res.redirect(`/${key}/${id}?updated=1`);
    } catch (error) {
      const localized = localizePrismaError(error, config);
      const errors = { _form: localized.message };
      if (localized.field) errors[localized.field] = localized.message;
      return renderFormPage(req, res, key, record, errors, req.body, 422);
    }
  };
}

export function deleteRecord(key) {
  return async (req, res) => {
    const config = forms[key];
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) return notFound(res, key);

    const record = await prisma[config.model].findUnique({ where: { id } });
    if (!record) return notFound(res, key);

    try {
      const related = await getRelatedInfo(key, id);
      const total = relatedTotal(related);

      if (total > 0 && req.body.cascade !== '1') {
        return res.redirect(`/${key}/${id}?error=related`);
      }

      if (total > 0) {
        await cascadeDelete(key, id);
      } else {
        await prisma[config.model].delete({ where: { id } });
      }

      return res.redirect(`/${key}?deleted=1`);
    } catch (error) {
      console.error(error);
      return res.redirect(`/${key}/${id}?error=db`);
    }
  };
}
