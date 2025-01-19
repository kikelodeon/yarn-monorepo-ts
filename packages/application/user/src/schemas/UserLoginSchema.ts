import Joi from 'joi';

export const UserLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });