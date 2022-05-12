import { useEffect, useState } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

export default function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    method: 'post',
    onSuccess: () => {
      Router.push('/orders');
    },
    url: '/api/payments',
  });

  function handlePayment({ id }) {
    doRequest({ orderId: order.id, token: id });
  }

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    const interval = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [order]);

  return timeLeft >= 0 ? (
    <>
      <div>Time left to pay: {timeLeft} seconds</div>
      <StripeCheckout
        stripeKey="pk_test_51JdOU6E66ru1QARfe6UWLsDe1dI8SBzc0f9WNFW27t2if4fz1c0lNhCloXF6BLeQJKtPw0wjPfbAunpt0drjcttE00BwlKTqIB"
        token={({ id }) => handlePayment({ id })}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </>
  ) : (
    <div>Order expired</div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    order: data,
  };
};
