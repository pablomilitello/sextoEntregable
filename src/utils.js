//__dirname
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
export const __dirname = dirname(fileURLToPath(import.meta.url));

export const ASC = 'asc';
export const DESC = 'desc';

export const TRUE = 'true';
export const FALSE = 'false';

//Validation
export const validateInteger = (input, lowerLimit, upperLimit) => {
  const num = parseInt(input);
  return Number.isInteger(num) && num >= lowerLimit && num <= upperLimit;
};

//Validate Sort
export const validateSort = (input) => {
  return input === ASC || input === DESC;
};

//Validate Boolean
export const validateBoolean = (input) => {
  return input === TRUE || input === FALSE;
};

const saltRound = 10;
//Hashear data
export const hashData = async (data) => {
  return bcrypt.hash(data, saltRound);
};

//Compare data
export const compareData = async (data, dataDB) => {
  return bcrypt.compare(data, dataDB);
};
