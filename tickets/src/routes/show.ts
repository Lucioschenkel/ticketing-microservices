import { NotFoundError } from "@lucioschenkel-tickets/common";
import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  if (!isIdValid) {
    throw new NotFoundError();
  }

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new NotFoundError();
  }

  return res.status(200).json(ticket);
});

export { router as showRouter };