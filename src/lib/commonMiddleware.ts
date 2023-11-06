import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';

import { ProxyHandler } from '../types/handler.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (handler: middy.PluginObject | ProxyHandler | undefined | any) =>
  middy(handler).use([httpJsonBodyParser(), httpEventNormalizer(), httpErrorHandler(), cors()]);
