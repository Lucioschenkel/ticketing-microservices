import request from 'supertest';

import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  const body = {
    email: 'test@test.com',
    password: 'password',
  };

  await request(app)
    .post('/api/users/signup')
    .send(body)
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      ...body,
      password: 'asd',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  const body = {
    email: 'test@test.com',
    password: 'password',
  };

  await request(app)
    .post('/api/users/signup')
    .send(body)
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send(body)
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});