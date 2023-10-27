import { AuctionsTable, db } from '../db/config';
import { createAuctionInput } from '../schema/auction.schema';

export async function addAuction(input: createAuctionInput) {
  return await db
    .put({
      TableName: AuctionsTable,
      Item: input,
    })
    .promise();
}

export async function destroyAuction(id: string) {
  return await db
    .delete({
      TableName: AuctionsTable,
      Key: {
        id: id,
      },
    })
    .promise();
}
