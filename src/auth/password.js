import crypto from 'node:crypto';

const lower = 'abcdefghijkmnopqrstuvwxyz';
const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const digits = '23456789';
const symbols = '!@#$%^&*';
const all = `${lower}${upper}${digits}${symbols}`;

function pick(chars) {
  return chars[crypto.randomInt(0, chars.length)];
}

export function generatePassword(length = 14) {
  const result = [pick(lower), pick(upper), pick(digits), pick(symbols)];

  while (result.length < length) {
    result.push(pick(all));
  }

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(0, index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result.join('');
}
