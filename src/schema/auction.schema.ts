import { object, string, TypeOf } from 'zod';

export const createAuctionSchema = object({
  title: string().trim().min(1, { message: 'Name is required.' }),
  status: string()
    .trim()
    .min(1, { message: 'Status is required.' })
    .refine(
      val => val !== 'OPEN' || 'CLOSED',
      val => ({ message: `${val} is invalid. Only accepts OPEN and CLOSED.` })
    ),
  createdAt: string().trim().min(1, { message: 'Date is required.' }),
});

export type createAuctionInput = TypeOf<typeof createAuctionSchema>;
