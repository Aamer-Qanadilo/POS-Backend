import joi from "joi";

export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
    }),
};

export const signin = {
  body: joi.object().required().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
};
