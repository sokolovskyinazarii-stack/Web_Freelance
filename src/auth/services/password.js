import generator from 'generate-password';

export const PASSWORD_MIN_LENGTH = 12;

/**
 * Криптографічно стійкий пароль: 20 символів, великі й малі літери,
 * цифри та символи, без схожих символів (0/O, 1/l).
 */
export function generatePassword(length = 20) {
  return generator.generate({
    length,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
    strict: true,
    excludeSimilarCharacters: true
  });
}

/** Повертає текст помилки або null, якщо пароль достатньо надійний. */
export function passwordProblem(password) {
  const value = String(password || '');
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Пароль має містити щонайменше ${PASSWORD_MIN_LENGTH} символів.`;
  }
  if (!/[A-Za-zА-Яа-яІіЇїЄєҐґ]/.test(value)) {
    return 'Пароль має містити хоча б одну літеру.';
  }
  if (!/\d/.test(value)) {
    return 'Пароль має містити хоча б одну цифру.';
  }
  return null;
}
