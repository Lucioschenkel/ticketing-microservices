import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const schema = yup.object().shape({
  title: yup.string().required(),
  price: yup.number().required().min(0.01),
});

function NewTicketPage() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  async function handleCreateTicket({ price, title }) {
    doRequest({ title, price });
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={handleSubmit(handleCreateTicket)}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" {...register('title')} />
        </div>
        <div className="form-group">
          <label htmlFor="title">Price</label>
          <input
            type="number"
            className="form-control"
            step="0.01"
            {...register('price')}
          />
        </div>
        {errors}
        <button className="btn btn-primary mt-4" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewTicketPage;
