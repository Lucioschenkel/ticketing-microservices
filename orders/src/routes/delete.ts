import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@lucioschenkel-tickets/common';
import { Router, Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { currentUser } = req;
    const { id } = req.params;

    const order = await Order.findById(id).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== currentUser!.id) {
      throw new NotAuthorizedError('The order does not belong to this user');
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    return res.status(204).json(order);
  }
);

export { router as deleteRouter };
