export function loadEnv() {
  // `cp _env .env` then modify it
  // See https://github.com/motdotla/dotenv
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require('dotenv').config().parsed;
  // Overwrite env variables anyways
  for (const k in config) {
    process.env[k] = config[k];
  }
}
