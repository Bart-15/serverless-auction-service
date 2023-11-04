import { number, object, string, TypeOf } from 'zod';

export const createAuctionSchema = object({
  id: string().optional(),
  title: string().trim().min(1, { message: 'Title is required.' }),
  seller: string()
    .min(1, { message: 'Email is required.' })
    .email('Please input valid email address'),
  status: string()
    .trim()
    .min(1, { message: 'Status is required.' })
    .refine(
      val => val !== 'OPEN' || 'CLOSED',
      val => ({ message: `${val} is invalid. Only accepts OPEN and CLOSED.` })
    ),
  highestBid: object({
    amount: number().positive(),
    bidder: string().optional(),
  }),
  createdAt: string().trim().min(1, { message: 'CreatedAt is required.' }),
  endingAt: string().trim().min(1, { message: 'EndingAt is required.' }),
});

export type createAuctionInput = TypeOf<typeof createAuctionSchema>;
