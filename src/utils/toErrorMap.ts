// take our errors and turn them into an object

import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};

  console.log(errors);

  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
