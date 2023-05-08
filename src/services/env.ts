import { cleanEnv, str } from 'envalid';
import os from 'os';
import SlackHook from 'winston-slack-webhook-transport';

import AbstractService from './service';
import logger from './logger';

const HOSTNAME = os.hostname();

export type EnvVariables = {
  NODE_ENV: 'production' | 'staging' | 'development' | 'test';
  LOCAL_TEST: 'true' | 'false';
  PORT: string;
  PGHOST: string;
  PGDATABASE: string;
  PGUSER: string;
  PGPASSWORD: string;
  PGPORT: string;
};

/*
 * This service is responsible for loading environment variables
 */
class EnvService implements AbstractService {
  static envVariables = {
    NODE_ENV: str({
      choices: ['development', 'staging', 'test', 'production'],
    }),
    LOCAL_TEST: str({
      choices: ['true', 'false'],
      default: 'false',
    }),
    PORT: str(),
    PGHOST: str(),
    PGDATABASE: str(),
    PGUSER: str(),
    PGPASSWORD: str(),
    PGPORT: str(),
  };

  static envs: Readonly<EnvVariables>;

  // This is an idempotent operation, you can call init as many times as you want
  static init(): void {
    this.envs = cleanEnv(process.env, EnvService.envVariables, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reporter: ({ errors }: { errors: any }) => {
        if (Object.keys(errors).length > 0) {
          logger.error(`Invalid env vars: ${Object.keys(errors)}`);
        }
      },
    });

    // Only for non test environments, add logger
    if (process.env.NODE_ENV !== 'test' && process.env.LOCAL_TEST !== 'true') {
      logger.add(
        new SlackHook({
          webhookUrl: process.env.SLACK_ERROR_WEBHOOK_URL || '',
          level: 'error',
          formatter: (info) => ({
            text: `${HOSTNAME} - ${info.timestamp} ${info.level}: ${info.message}`,
          }),
        })
      );
    }

    // Local test should only be set in development
    if (
      process.env.LOCAL_TEST === 'true' &&
      process.env.NODE_ENV !== 'development'
    ) {
      throw new Error('LOCAL_TEST can only be set in development');
    }

    logger.info(`Loaded env and running in env ${process.env.NODE_ENV}`);
  }

  static env(): Readonly<EnvVariables> {
    return (
      this.envs ?? {
        NODE_ENV: 'test',
        PORT: '3001',
      }
    );
  }
}

export default EnvService;
