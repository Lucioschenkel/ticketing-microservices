import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@lucioschenkel-tickets/common';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

const router = Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('E-mail must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters long')
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('The provided e-mail is already in use');
  }

  const user = User.build({
    email,
    password,
  });

  await user.save();

  const userToken = jwt.sign(
    {
      email: user.email,
      id: user.id
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userToken,
  };

  res.status(201).json(user);
});

export { router as signUpRouter };

