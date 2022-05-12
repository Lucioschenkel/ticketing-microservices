import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@lucioschenkel-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
