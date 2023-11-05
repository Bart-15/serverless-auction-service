import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface ENV {
  AUCTIONS_TABLE_NAME: string | undefined;
  MAIL_QUEUE_URL: string | undefined;
  FILE_UPLOAD_BUCKET_NAME: string | undefined;
}

interface Config {
  AUCTIONS_TABLE_NAME: string;
  MAIL_QUEUE_URL: string;
  FILE_UPLOAD_BUCKET_NAME: string;
}

export const getConfig = (): ENV => {
  return {
    AUCTIONS_TABLE_NAME: process.env.AUCTIONS_TABLE_NAME,
    MAIL_QUEUE_URL: process.env.MAIL_QUEUE_URL,
    FILE_UPLOAD_BUCKET_NAME: process.env.FILE_UPLOAD_BUCKET_NAME,
  };
};

const getSanitezedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitezedConfig(config);

export default sanitizedConfig;
