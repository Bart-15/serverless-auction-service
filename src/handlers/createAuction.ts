/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

import commonMiddleware from '../lib/commonMiddleware';
import { handleError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import validateResource from '../middleware/validateResource';
import { createAuctionInput, createAuctionSchema } from '../schema/auction.schema';
import { addAuction } from '../services/auction.service';

const createAuctions = async (
  event: APIGatewayProxyEventV2 & { requestContext: { authorizer: any } }
) => {
  try {
    const body = event.body as unknown as createAuctionInput;

    const { email } = event.requestContext.authorizer;

    // eslint-disable-next-line no-console
    console.log(event.requestContext);
    const endDate = new Date();
    endDate.setHours(new Date().getHours() + 1);

    const newAuction = {
      id: uuidv4(),
      seller: email,
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
