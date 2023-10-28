import { number, object, string, TypeOf } from 'zod';

export const createAuctionSchema = object({
  id: string().optional(),
  title: string().trim().min(1, { message: 'Title is required.' }),
  status: string()
    .trim()
    .min(1, { message: 'Status is required.' })
    .refine(
      val => val !== 'OPEN' || 'CLOSED',
      val => ({ message: `${val} is invalid. Only accepts OPEN and CLOSED.` })
    ),
  highestBid: object({
    amount: number().positive(),
  }),
  createdAt: string().trim().min(1, { message: 'Date is required.' }),
});

export type createAuctionInput = TypeOf<typeof createAuctionSchema>;
