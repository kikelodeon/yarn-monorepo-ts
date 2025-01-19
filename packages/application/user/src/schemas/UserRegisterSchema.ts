import Joi from 'joi';

export const UserRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().optional(),
});
