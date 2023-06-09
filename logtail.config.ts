import { createLogger, format, transports } from 'winston';
import { LogtailTransport } from '@logtail/winston';
import { Logtail } from '@logtail/node';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export const logger = (source_token: string) => {
  const logtail = new Logtail(source_token);

  return createLogger({
    level: 'info',
    levels,
    format: combine(timestamp(), logFormat),
    transports: [new LogtailTransport(logtail), new transports.Console()],
  });
};
