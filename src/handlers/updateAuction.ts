import commonMiddleware from '../lib/commonMiddleware';
import { handleError, HttpError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import validateResource from '../middleware/validateResource';
import { createAuctionInput, createAuctionSchema } from '../schema/auction.schema';
import { getAuctionById, updateAuction } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

const update: ProxyHandler = async event => {
  try {
    const id = event.pathParameters?.id as string;

    const auction = await getAuctionById(id);

    if (!auction) {
      throw new HttpError(404, { errorMessage: 'Auction not found' });
    }

    if (auction?.status === 'CLOSED') {
      throw new HttpError(403, { errorMessage: 'You cannot update on closed auction' });
    }

    const reqBody = event.body as unknown as createAuctionInput;

    const newAuction = {
      title: reqBody.title,
      status: reqBody.status,
      createdAt: new Date().toISOString(),
      highestBid: {
        amount: auction.highestBid.amount,
      },
      endingAt: reqBody.endingAt,
    };

    validateResource(createAuctionSchema, newAuction);

    await updateAuction(id, newAuction);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Auction updated successfully',
        auction: {
          id,
          ...newAuction,
        },
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const handler = commonMiddleware(update);
