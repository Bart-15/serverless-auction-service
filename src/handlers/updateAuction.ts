import { handleError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import validateResource from '../middleware/validateResource';
import { createAuctionInput, createAuctionSchema } from '../schema/auction.schema';
import { getAuctionById, updateAuction } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

export const handler: ProxyHandler = async event => {
  try {
    const id = event.pathParameters?.id as string;

    const auction = await getAuctionById(id);

    if (!auction)
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: 'Auction not found',
        }),
      };

    const reqBody = JSON.parse(event.body as string) as createAuctionInput;

    const newAuction = {
      title: reqBody.title,
      status: reqBody.status,
      createdAt: new Date().toISOString(),
      highestBid: {
        amount: auction.highestBid.amount,
      },
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
