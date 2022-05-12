import request from 'supertest';
import { Ticket } from '../../models/ticket';

import { app } from '../../app';

import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for posts requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  return request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
  });

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Nice test',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Nice test',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find();

  expect(tickets.length).toEqual(0);

  const price = 1;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Nice title',
      price,
    })
    .expect(201);

  tickets = await Ticket.find();

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
});

it('publishes an event', async () => {
  const price = 1;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Nice title',
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
