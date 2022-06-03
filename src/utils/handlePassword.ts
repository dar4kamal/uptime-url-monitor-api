import { genSalt, compare, hash } from 'bcrypt';

export const hashPassword = async (word: string) => {
  const salt = await genSalt(10);
  return hash(word, salt);
};

export const checkPassword = (hashedPass: string, word: string) => {
  return compare(word, hashedPass);
};
