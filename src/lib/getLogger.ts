import winston, { Logger } from "winston";
import { NODE_ENV } from "../config";

const getLogger = (service: string): Logger => {
  const isInfo = ["development", "qa"].indexOf(NODE_ENV) < 0;
  const logger = winston.createLogger({
    level: isInfo ? "info" : "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf((msg) => {
        return `${msg.timestamp} ${msg.service} ${msg.level}: ${msg.message}`;
      })
    ),
    transports: [
      new winston.transports.File({ filename: "logs/error.log", level: "error" }),
      new winston.transports.File({ filename: "logs/combined.log" }),
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
