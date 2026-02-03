import rateLimit from "express-rate-limit";

export const verifyTokenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: {
      code: "MANY_REQUESTS",
      message: "Too many request. Please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    error: {
      code: "MANY_REQUESTS",
      message:
        "Too many requests. Please try again in 15 minutes.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.email.toLowerCase(),
});

export const forgotPasswordIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      code: "MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    },
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: {
      code: "MANY_REQUESTS",
      message: "Too many attempts. Please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const superAdminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    eror: {
      code: "MANY_REQUESTS",
      message: "Too many attempts. Please try again in 15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
