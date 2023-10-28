import { handleError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import validateResource from '../middleware/validateResource';
import { createAuctionInput, createAuctionSchema } from '../schema/auction.schema';
import { getAuctionById, updateAuction } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

export const handler: ProxyHandler = async event => {
  try {
    const id = event.pathParameters?.id as string;
    const { amount } = JSON.parse(event.body as string);

    if (!amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          amount: 'Amount is required',
        }),
      };
    }

    const auction = await getAuctionById(id);

    if (amount <= auction?.highestBid.amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          amount: `Your bid is must be higher than ${amount}`,
        }),
      };
    }

    if (!auction)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: 'Auction not found',
        }),
      };

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
