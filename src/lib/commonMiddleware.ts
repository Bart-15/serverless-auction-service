/* eslint-disable @typescript-eslint/no-explicit-any */
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';

import { ProxyHandler } from '../types/handler.types';

export default (handler: middy.PluginObject | ProxyHandler | undefined | any) =>
  middy(handler).use([httpJsonBodyParser(), httpEventNormalizer(), httpErrorHandler()]);
