import validator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';

import commonMiddleware from '../lib/commonMiddleware';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema';
import { handleError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import { index } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

const getAuctions: ProxyHandler = async event => {
  try {
    const { status } = event.queryStringParameters!;

    const query = {
      status: status,
    };
    const auctions = await index(query);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        auctions: auctions,
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const handler = commonMiddleware(getAuctions).use(
  validator({ eventSchema: transpileSchema(getAuctionsSchema) })
);
