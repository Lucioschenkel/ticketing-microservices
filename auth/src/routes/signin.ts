import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@lucioschenkel-tickets/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = Router();

router.post('/api/users/signin',[
  body('email')
    .isEmail()
    .withMessage('E-mail must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Invalid password')
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid username or password');
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid username or password');
  }

  const userToken = jwt.sign(
    {
      email: existingUser.email,
      id: existingUser.id
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userToken,
  };

  res.status(200).json(existingUser);
});

export { router as signInRouter };

