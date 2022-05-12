import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@lucioschenkel-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
