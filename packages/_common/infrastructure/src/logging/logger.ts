// packages/infrastructure/_common/src/logging/logger.ts
import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';
import dayjs from 'dayjs';

const { combine, timestamp, printf } = format;

// Formato personalizado
const consoleFormat = printf((info) => {
  // Aseguramos que el timestamp es una cadena
  const rawTimestamp = typeof info.timestamp === 'string' ? info.timestamp : new Date().toISOString();
  
  // Formateamos la fecha usando dayjs
  const formattedDate = dayjs(rawTimestamp).format('YYYY-MM-DD HH:mm:ss');
  const greyDate = chalk.gray(formattedDate);

  // Asignamos colores al nivel
  let coloredLevel: string;
  switch (info.level) {
    case 'error':
      coloredLevel = chalk.red(info.level);
      break;
    case 'warn':
      coloredLevel = chalk.yellow(info.level);
      break;
    case 'info':
      coloredLevel = chalk.green(info.level);
      break;
    case 'debug':
      coloredLevel = chalk.blue(info.level);
      break;
    default:
      coloredLevel = info.level; // Sin color para niveles personalizados
  }

  // Extraemos los datos adicionales
  const { level, message, timestamp, ...rest } = info;
  const extraData = Object.keys(rest).length ? JSON.stringify(rest) : '';

  return `${greyDate} [${coloredLevel}]: ${message} ${extraData}`;
});

export const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    consoleFormat
  ),
  transports: [
    new transports.Console(),
  ],
});
/*
// packages/infrastructure/_common/src/logging/logger.ts
import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';
import dayjs from 'dayjs';

const { combine, timestamp, printf } = format;

// Formato personalizado
const consoleFormat = printf((info) => {
  // Aseguramos que el timestamp es una cadena
  const rawTimestamp = typeof info.timestamp === 'string' ? info.timestamp : new Date().toISOString();
  
  // Formateamos la fecha usando dayjs
  const formattedDate = dayjs(rawTimestamp).format('YYYY-MM-DD HH:mm:ss');
  const greyDate = chalk.gray(formattedDate);

  // Asignamos colores al nivel
  let coloredLevel: string;
  switch (info.level) {
    case 'error':
      coloredLevel = chalk.red(info.level);
      break;
    case 'warn':
      coloredLevel = chalk.yellow(info.level);
      break;
    case 'info':
      coloredLevel = chalk.green(info.level);
      break;
    case 'debug':
      coloredLevel = chalk.blue(info.level);
      break;
    default:
      coloredLevel = info.level; // Sin color para niveles personalizados
  }

  // Extraemos los datos adicionales
  const { level, message, timestamp, ...rest } = info;
  const extraData = Object.keys(rest).length ? JSON.stringify(rest) : '';

  return `${greyDate} [${coloredLevel}]: ${message} ${extraData}`;
});

export const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    consoleFormat
  ),
  transports: [
    new transports.Console(),
  ],
});
*/