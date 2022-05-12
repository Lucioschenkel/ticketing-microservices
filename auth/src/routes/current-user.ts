import { Router } from 'express';

import { currentUser } from '@lucioschenkel-tickets/common';

const router = Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  const { currentUser = null } = req;

  res.json({ currentUser });
});

export { router as currentUserRouter };

