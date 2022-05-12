import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function TicketShow({ ticket }) {
  const { doRequest, errors } = useRequest({
    method: 'post',
    url: '/api/orders',
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      <button
        className="btn btn-primary"
        onClick={() => doRequest({ ticketId: ticket.id })}
      >
        Purchase
      </button>
    </div>
  );
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return {
    ticket: data,
  };
};
