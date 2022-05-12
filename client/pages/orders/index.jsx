export default function OrdersPage({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
}

OrdersPage.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders`);

  return {
    orders: data,
  };
};
