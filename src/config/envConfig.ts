// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config().parsed;

interface ENV {
  AUCTIONS_TABLE_NAME: string | undefined;
}

interface Config {
  AUCTIONS_TABLE_NAME: string;
}

export const getConfig = (): ENV => {
  return {
    AUCTIONS_TABLE_NAME: process.env.AUCTIONS_TABLE_NAME,
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
