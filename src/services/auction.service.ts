import { AuctionsTable, db } from '../db/config';
import { generateUpdateQuery } from '../helpers/helpers';
import { createAuctionInput } from '../schema/auction.schema';

export async function addAuction(input: createAuctionInput) {
  return await db
    .put({
      TableName: AuctionsTable,
      Item: input,
    })
    .promise();
}

export async function index() {
  const auctions = await db
    .scan({
      TableName: AuctionsTable,
    })
    .promise();

  return auctions.Items;
}

export async function getAuctionById(id: string) {
  const auction = await db
    .get({
      TableName: AuctionsTable,
      Key: {
        id: id,
      },
    })
    .promise();

  return auction.Item;
}

export async function updateAuction(id: string, input: Partial<createAuctionInput>) {
  const data = generateUpdateQuery(input);

  const params = {
    TableName: AuctionsTable,
    Key: {
      id: id,
    },
    ConditionExpression: 'attribute_exists(id)',
    ...data,
    ReturnValues: 'ALL_NEW',
  };

  return await db.update(params).promise();
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
