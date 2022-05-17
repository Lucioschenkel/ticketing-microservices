import Link from 'next/link';

function LandingPage({ currentUser, tickets }) {
  console.log('Home started...');

  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a className="nav-link">Details</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return {
    tickets: data,
  };
};

export default LandingPage;
