import commonMiddleware from '../lib/commonMiddleware';
import { handleError, HttpError } from '../middleware/errHandler';
import { uploadImage } from '../services/auction.uploadFiles.service';
import { ProxyHandler } from '../types/handler.types';

export type TImageUpload = {
  file: string;
};

const uploadAuctionImage: ProxyHandler = async event => {
  try {
    const parsedBody = event.body as unknown as TImageUpload;

    if (!parsedBody?.file) throw new HttpError(400, { error: 'Base64 image is required.' });

    const { res, presignedUrl } = await uploadImage(parsedBody);

    return {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully uploaded file to S3',
        presignedURL: presignedUrl,
        url: res,
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const handler = commonMiddleware(uploadAuctionImage);
