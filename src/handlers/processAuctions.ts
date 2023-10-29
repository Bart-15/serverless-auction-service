/* eslint-disable no-console */
import { closeAuction } from '../lib/closeAuction';
import { getEndedAuctions } from '../lib/getEndedAuctions';
import { handleError } from '../middleware/errHandler';

export const handler = async () => {
  try {
    // eslint-disable-next-line no-console
    const auctionsToClose = await getEndedAuctions();
    const closed = auctionsToClose.map(auction => closeAuction(auction));
    await Promise.all(closed);

    return {
      closed: closed.length,
    };
  } catch (error) {
    return handleError(error);
  }
};
