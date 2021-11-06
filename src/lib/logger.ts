import logger from "winston";

logger.configure({
  level: process.env[`NODE_ENV`] !== "development" ? "info" : "debug",
  format: logger.format.combine(
    logger.format.timestamp(),
    logger.format.splat(),
    logger.format.printf((msg) => {
      return `${msg.timestamp} ${msg.service} ${msg.level}: ${msg.message}`;
    })
  ),
  transports: [
    new logger.transports.File({ filename: "error.log", level: "error" }),
    new logger.transports.File({ filename: "combined.log" }),
  ],
  defaultMeta: { service: 'server' },
});

if (process.env[`NODE_ENV`] !== "production") {
  logger.add(
    new logger.transports.Console({
      format: logger.format.combine(logger.format.colorize({ all: true })),
    })
  );
}

export default logger;
