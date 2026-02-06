import { Transform } from 'class-transformer';

export const sanitizeInput = (input: string): string => {
  const dangerousCharsPattern = /[<>/";:'[{}]`]/g;
  return input.replace(dangerousCharsPattern, '');
};

export const Sanitize = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      return sanitizeInput(value);
    }
    return value;
  });
