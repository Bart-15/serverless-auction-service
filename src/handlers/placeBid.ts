import { handleError, HttpError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import { getAuctionById, updateAuction } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

export const handler: ProxyHandler = async event => {
  try {
    const id = event.pathParameters?.id as string;
    const { amount } = JSON.parse(event.body as string);

    if (!amount) {
      throw new HttpError(400, { errorMessage: 'Amount is required' });
    }

    const auction = await getAuctionById(id);

    if (!auction) {
      throw new HttpError(404, { errorMessage: `Auction not found` });
    }

    if (auction?.status === 'CLOSED') {
      throw new HttpError(403, { errorMessage: 'You cannot bid on closed auctions' });
    }

    if (amount <= auction?.highestBid.amount) {
      throw new HttpError(400, { errorMessage: `Your bid is must be higher than ${amount}` });
    }

    const updatedAuction = {
      highestBid: {
        amount: amount,
      },
    };

    const results = await updateAuction(id, updatedAuction);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Auction updated successfully',
        auction: results.Attributes,
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};
