import { Publisher, Subjects, TicketUpdatedEvent } from "@lucioschenkel-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}