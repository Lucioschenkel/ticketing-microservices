import { TicketCreatedEvent } from '@lucioschenkel-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
    title: 'concert',
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
  };
};

it('creates and saves a ticket', async () => {
  const { data, listener, message } = await setup();
  // call the onMessage function with the fake data and fake message
  await listener.onMessage(data, message);

  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});

it('acknowledges the message', async () => {
  const { data, listener, message } = await setup();
  // call the onMessage function with the fake data and fake message
  await listener.onMessage(data, message);

  // write assertions to make sure it acknowledges the message
  expect(message.ack).toHaveBeenCalled();
});
