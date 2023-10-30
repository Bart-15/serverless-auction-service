import validator from '@middy/validator';
import { v4 as uuidv4 } from 'uuid';

import commonMiddleware from '../lib/commonMiddleware';
import { handleError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import validateResource from '../middleware/validateResource';
import { createAuctionInput, createAuctionSchema } from '../schema/auction.schema';
import { addAuction } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

const createAuctions: ProxyHandler = async event => {
  try {
    const body = event.body as unknown as createAuctionInput;

    const endDate = new Date();
    endDate.setHours(new Date().getHours() + 1);

    const newAuction = {
      id: uuidv4(),
      title: body?.title,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: body?.highestBid.amount,
      },
    };

    validateResource(createAuctionSchema, newAuction);

    await addAuction(newAuction);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        auction: newAuction,
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const handler = commonMiddleware(createAuctions);
