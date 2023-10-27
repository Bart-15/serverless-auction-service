import { v4 as uuidv4 } from 'uuid';

import { handleError } from '../middleware/errHandler';
import validateResource from '../middleware/validateResource';
import { createAuctionInput, createAuctionSchema } from '../schema/auction.schema';
import { addAuction } from '../services/auction.service';
import { ProxyHandler } from '../types/handler.types';

const headers = {
  'content-type': 'application/json',
};

export const handler: ProxyHandler = async event => {
  try {
    const body = JSON.parse(event.body as string) as createAuctionInput;

    const newAuction = {
      id: uuidv4(),
      title: body.title,
      status: body.status,
      createdAt: new Date().toISOString(),
    };

    validateResource(createAuctionSchema, newAuction);

    await addAuction(newAuction);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        auction: newAuction,
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};
