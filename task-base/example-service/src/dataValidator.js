import Joi from "joi";

const medicationSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  count: Joi.number().integer().min(0),
  destination_count: Joi.number().integer().min(0),
});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

export const validateMedication = (req, res, next) => {
  const { error } = medicationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
