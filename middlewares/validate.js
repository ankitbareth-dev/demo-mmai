import { envVariables } from "../config/envVariables.js";

export const validate = (schema) => (req, res, next) => {
  const options = { abortEarly: false, stripUnknown: true, convert: true };

  const { error, value } = schema.validate(req.body, options);

  if (error) {
    if (envVariables.NODE_ENV !== "production") console.error(error);

    const details = error.details.map((d) => d.message.replace(/["']/g, ""));
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: details,
    });
  }

  req.body = value;
  next();
};
