import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@lucioschenkel-tickets/common';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const isIdValid = mongoose.Types.ObjectId.isValid(id);
    if (!isIdValid) {
      throw new NotFoundError();
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    const { currentUser } = req;
    if (currentUser?.id !== ticket.userId) {
      throw new NotAuthorizedError('The user does not own this ticket');
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.status(200).json(ticket);
  }
);

export { router as updateRouter };
