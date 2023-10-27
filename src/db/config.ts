/* eslint-disable @typescript-eslint/no-extra-non-null-assertion */
import AWS from 'aws-sdk';

export const db = new AWS.DynamoDB.DocumentClient();

export const s3 = new AWS.S3();

// Table
export const AuctionsTable = 'AuctionsTable';
