import { handleError } from '@/middleware/errHandler';
import { createAuctionInput } from '@/schema/auction.schema';
import { ProxyHandler } from '@/types/handler.types';

const headers = {
  'content-type': 'application/json',
};

export const handler: ProxyHandler = async event => {
  try {
    const body = JSON.parse(event.body as string) as createAuctionInput;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(body),
    };
  } catch (error) {
    return handleError(error);
  }
};
