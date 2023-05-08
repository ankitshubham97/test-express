import os from 'os';
import winston, { format } from 'winston';

export const prettyJSON = (data: unknown) => JSON.stringify(data, null, 2);

const HOSTNAME = os.hostname();

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(
    (info) => `${HOSTNAME} - ${info.timestamp} ${info.level}: ${info.message}`
  )
);

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  level: 'info',
  format: alignedWithColorsAndTime,
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false,
});

export default logger;
