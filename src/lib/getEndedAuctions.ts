import config from '../config/envConfig';
import { db } from '../db/db';
import { createAuctionInput } from '../schema/auction.schema';

export async function getEndedAuctions() {
  const now = new Date();
  const params = {
    TableName: config.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  const result = await db.query(params).promise();

  return result.Items as createAuctionInput[];
}
