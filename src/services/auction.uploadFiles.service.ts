import AWS from 'aws-sdk';

import config from '../config/envConfig';

const s3 = new AWS.S3();

export type TImageUpload = {
  file: string;
};

const generatePresignedURL = async (imgName: string) => {
  const params = {
    Bucket: config.FILE_UPLOAD_BUCKET_NAME as string,
    Key: `${imgName}`, //filename
    Expires: 30 * 60, //time to expire in seconds (5 minutes)
  };

  return s3.getSignedUrl('putObject', params);
};

export async function uploadImage(parsedBody: TImageUpload) {
  const base64File = parsedBody.file;

  const decodedFile: Buffer = Buffer.from(
    base64File.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  );

  const imageName = `images/${new Date().toISOString()}.jpeg`;
  const params: AWS.S3.PutObjectRequest = {
    Bucket: config.FILE_UPLOAD_BUCKET_NAME as string,
    Key: imageName,
    Body: decodedFile,
    ContentType: 'image/jpeg',
  };

  const res = await s3.upload(params).promise();
  const presignedUrl = await generatePresignedURL(imageName);

  return { res, presignedUrl };
}
