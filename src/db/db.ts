import AWS from 'aws-sdk';

import config from '../config/envConfig';
export const db = new AWS.DynamoDB.DocumentClient();

export const s3 = new AWS.S3();

// Table
export const AuctionsTable = config.AUCTIONS_TABLE_NAME;
