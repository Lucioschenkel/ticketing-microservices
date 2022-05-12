export enum OrderStatus {
  // When the order has been created, but the ticket has not been reserved
  Created = 'created',
  // The ticket was already reserved, the user has cancelled the order or the
  // order expired before payment
  Cancelled = 'cancelled',
  // The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting-payment',
  // The order has successfully reserved the ticket and the payment succeeded
  Complete = 'complete',
};
