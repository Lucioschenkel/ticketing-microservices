import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@lucioschenkel-tickets/common';
import { natsWrapper } from '../nats-wrapper';

import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const { currentUser } = req;

    const ticket = Ticket.build({
      title,
      price,
      userId: currentUser!.id,
    });

    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.status(201).send(ticket);
  }
);

export { router as newRouter };
