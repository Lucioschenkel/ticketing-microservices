import { TicketUpdatedEvent } from '@lucioschenkel-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    price: 999,
    version: ticket.version + 1,
    title: 'new concert',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake Message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    message,
    ticket,
  };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, message, ticket } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it('acknowledges the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it('does not call ack with the event has a skipped version number', async () => {
  const { listener, data, message, ticket } = await setup();

  data.version = 10000;

  expect(async () => {
    await listener.onMessage(data, message);
  }).rejects;

  expect(message.ack).not.toHaveBeenCalled();
});
