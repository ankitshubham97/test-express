import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express from 'express';
import HttpException from '../exceptions/http.exception';

import logger from '../services/logger';

export type PartToValidate = 'body' | 'pathParam' | 'queryParam';

function validationMiddleware(
  partToValidate: PartToValidate,
  cls: ClassConstructor<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  skipMissingProperties = false
): express.RequestHandler {
  return (req, _res, next) => {
    let plain: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    /* istanbul ignore else */
    if (partToValidate === 'body') {
      plain = req.body;
    } else if (partToValidate === 'pathParam') {
      plain = req.params;
    } else if (partToValidate === 'queryParam') {
      plain = req.query;
    } else {
      // Compile time check that code can't reach here
      next(new HttpException(400, ''));
      return;
    }
    validate(plainToClass(cls, plain), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => {
              const constraints = error?.constraints;

              /* istanbul ignore else */
              if (constraints) {
                return Object.values(constraints);
              } else {
                return [];
              }
            })
            .join(', ');
          logger.error(JSON.stringify(message));
          next(new HttpException(400, message));
        } else {
          next();
        }
      }
    );
  };
}

export { validationMiddleware };
