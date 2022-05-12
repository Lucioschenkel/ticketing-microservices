import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    price: 30,
    title: 'concert',
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  return ticket;
};

it('fetches orders for a particular user', async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
  expect(response.body[0].id).toBe(order1.id);
  expect(response.body[1].id).toBe(order2.id);
});
