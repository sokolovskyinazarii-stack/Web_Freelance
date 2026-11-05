import { Prisma } from '@prisma/client';

export function localizePrismaError(error, config) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target) ? error.meta.target[0] : error.meta?.target;
      const field = config.fields.find((item) => item.name === target);
      return {
        field: field?.name,
        message: field
          ? `Таке значення поля «${field.label}» вже використовується.`
          : 'Таке значення вже використовується. Перевірте унікальні поля.'
      };
    }

    if (error.code === 'P2003') {
      return {
        message: 'Пов’язаний запис не знайдено або його неможливо використати.'
      };
    }

    if (error.code === 'P2025') {
      return { message: 'Запис не знайдено. Можливо, його вже видалено.' };
    }
  }

  return { message: 'Помилка бази даних. Спробуйте ще раз.' };
}
