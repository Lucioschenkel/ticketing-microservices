import { Publisher, Subjects, TicketCreatedEvent } from "@lucioschenkel-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}