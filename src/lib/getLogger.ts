import winston, { Logger } from "winston";
import { NODE_ENV } from "../config";

const getLogger = (service: string): Logger => {
  const logger = winston.createLogger({
    level: NODE_ENV !== "development" ? "info" : "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf((msg) => {
        return `${msg.timestamp} ${msg.service} ${msg.level}: ${msg.message}`;
      })
    ),
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
    defaultMeta: { service },
  });

  if (NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize({ all: true })),
      })
    );
  }

  return logger;
}

export default getLogger;
