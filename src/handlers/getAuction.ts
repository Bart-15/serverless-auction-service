import { handleError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import { getAuctionById } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

export const handler: ProxyHandler = async events => {
  try {
    const user = await getAuctionById(events.pathParameters?.id as string);

    if (!user)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: 'Auction not found',
        }),
      };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return handleError(error);
  }
};
