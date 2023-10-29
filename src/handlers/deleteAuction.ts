import { handleError, HttpError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import { destroyAuction, getAuctionById } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

export const handler: ProxyHandler = async events => {
  try {
    const id = events.pathParameters?.id as string;
    const auction = await getAuctionById(id);

    if (!auction) {
      throw new HttpError(404, { errorMessage: `Auction not found` });
    }

    await destroyAuction(id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Auction deleted successfully',
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};
