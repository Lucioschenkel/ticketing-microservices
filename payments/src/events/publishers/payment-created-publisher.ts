import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@lucioschenkel-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
