import request from 'supertest';

import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
  await request(app)
    .get('/api/tickets/avc')
    .send()
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const expected = {
    title: 'Nice title',
    price: 20
  };

  const { title, price } = expected;

  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const received = await request(app)
    .get(`/api/tickets/${body.id}`)
    .send()
    .expect(200);

  expect(received.body.title).toEqual(expected.title);
  expect(received.body.price).toEqual(expected.price);
});