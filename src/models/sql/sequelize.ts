import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import EnvService from '../../services/env';
import logger from '../../services/logger';

logger.info(`Connecting to ${EnvService.env().PGDATABASE}`);

const params: SequelizeOptions = {
  host: EnvService.env().PGHOST,
  port: Number(EnvService.env().PGPORT),
  dialect: 'postgres',
  models: [__dirname + '/**/*.model.*'],
  repositoryMode: true,
};

if (process.env.LOCAL_TEST !== 'true' && process.env.NODE_ENV !== 'test') {
  params.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

export const sequelize = new Sequelize(
  EnvService.env().PGDATABASE,
  EnvService.env().PGUSER,
  EnvService.env().PGPASSWORD,
  params
);
