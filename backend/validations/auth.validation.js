import Joi from 'joi';

export const firebaseLoginSchema = Joi.object({
  firebaseToken: Joi.string(),
  idToken: Joi.string()
}).xor('firebaseToken', 'idToken');
