import { AuctionsTable, db } from '../db/db';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function index(query: Record<string, string | any>) {
  const params = {
    TableName: AuctionsTable,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': query.status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  const auctions = await db.query(params).promise();
  return auctions.Items as createAuctionInput[];
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
