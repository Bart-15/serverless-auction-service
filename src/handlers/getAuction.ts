import { handleError, HttpError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import { getAuctionById } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

export const handler: ProxyHandler = async events => {
  try {
    const auction = await getAuctionById(events.pathParameters?.id as string);

    if (!auction) {
      throw new HttpError(404, { errorMessage: `Auction not found` });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(auction),
    };
  } catch (error) {
    return handleError(error);
  }
};
