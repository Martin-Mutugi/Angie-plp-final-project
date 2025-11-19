import Joi from 'joi';

export const registerValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'DONOR').default('DONOR')
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});