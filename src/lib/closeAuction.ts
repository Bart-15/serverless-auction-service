import AWS from 'aws-sdk';

import { createAuctionInput } from '@/schema/auction.schema';

import config from '../config/envConfig';
import { db } from '../db/db';

const sqs = new AWS.SQS();

export async function closeAuction(auction: createAuctionInput) {
  const params = {
    TableName: config.AUCTIONS_TABLE_NAME,
    Key: {
      id: auction.id,
    },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  await db.update(params).promise();

  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;

  if (amount === 0) {
    await sqs
      .sendMessage({
        QueueUrl: config.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'No bids on your auction item :(',
          recipient: seller,
          body: `Oooops! Your item "${title}" didn't get any bids. Better luck next time.`,
        }),
      })
      .promise();
    return;
  }

  const notifSeller = sqs
    .sendMessage({
      QueueUrl: config.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'Your item has been sold',
        recipient: seller,
        body: `Yehey, Mate! Your item "${title}" has been sold for $${amount}`,
      }),
    })
    .promise();

  // eslint-disable-next-line no-console
  console.log('HighestBid', highestBid);
  const notifBidder = sqs
    .sendMessage({
      QueueUrl: config.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'You won an auction!',
        recipient: bidder,
        body: `What a great deal! You got yourself a ${title} for $${amount}`,
      }),
    })
    .promise();

  return Promise.all([notifSeller, notifBidder]);
}
