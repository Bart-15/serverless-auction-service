import { APIGatewayProxyEventV2 } from 'aws-lambda';

import commonMiddleware from '../lib/commonMiddleware';
import { handleError, HttpError } from '../middleware/errHandler';
import { headers } from '../middleware/headers';
import { getAuctionById, updateAuction } from '../services/auction.service';

type TAmt = {
  amount: number;
};
const placeBid = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: APIGatewayProxyEventV2 & { requestContext: { authorizer: any } }
) => {
  try {
    const id = event.pathParameters?.id as string;
    const { amount } = event.body as unknown as TAmt;
    const { email } = event.requestContext.authorizer;

    if (!amount) {
      throw new HttpError(400, { errorMessage: 'Amount is required' });
    }

    const auction = await getAuctionById(id);

    if (!auction) {
      throw new HttpError(404, { errorMessage: `Auction not found` });
    }

    // Bid identity validation
    if (email === auction?.seller) {
      throw new HttpError(400, {
        errorMessage: `You cannot bid on your own auctions!`,
      });
    }

    //Avoid double bidding
    if (email === auction?.highestBid.bidder) {
      throw new HttpError(400, {
        errorMessage: `You are already the highest bidder.`,
      });
    }

    if (auction?.status === 'CLOSED') {
      throw new HttpError(403, { errorMessage: 'You cannot bid on closed auctions' });
    }

    if (amount <= auction.seller) {
      throw new HttpError(400, {
        errorMessage: `Your bid is must be higher than ${auction?.highestBid.amount}`,
      });
    }

    const updatedAuction = {
      highestBid: {
        amount: amount,
        bidder: email,
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

export const handler = commonMiddleware(placeBid);
