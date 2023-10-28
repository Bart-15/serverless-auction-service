import { handleError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import { index } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

export const handler: ProxyHandler = async () => {
  try {
    const auctions = await index();

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
