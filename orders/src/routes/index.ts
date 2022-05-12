import { Router, Request, Response } from 'express';
import { requireAuth } from '@lucioschenkel-tickets/common';
import { Order } from '../models/order';

const router = Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const { currentUser } = req;

  const orders = await Order.find({
    userId: currentUser!.id
  })
  .populate('ticket');

  return res.status(200).json(orders);
});

export { router as indexRouter };
