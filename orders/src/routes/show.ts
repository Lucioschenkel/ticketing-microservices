import { Router, Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@lucioschenkel-tickets/common';
import { Order } from '../models/order';

const router = Router();

router.get('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const { currentUser } = req;

  const order = await Order
    .findById(req.params.id)
    .populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== currentUser!.id) {
    throw new NotAuthorizedError('The user does not have access to this order');
  }

  return res.json(order);
});

export { router as showRouter };
