import { Alert, Button, Spin } from "antd";
import React, { useDeferredValue, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { optionsSelector, setLimit } from "../../store/optionsSlice";
import { fetchTickets, ticketsSelector } from "../../store/ticketsSlice";
import { Tickets } from "../../types/Tickets";
import { useAppDispatch, useAppSelector } from "../../utils/store/redux";
import TicketCard from "../TicketCard";

const TicketList = () => {
  const { tickets, status } = useAppSelector(ticketsSelector);
  const { filterTransplants, sortedBy, limit } =
    useAppSelector(optionsSelector);
  const dispatch = useAppDispatch();

  const perPageLimit = 50;

  const [ticketsState, setTicketsState] = useState<Tickets[]>(
    tickets.slice(0, 5),
  );
  const ticketsDeferred = useDeferredValue(ticketsState);

  useEffect(() => {
    setTicketsState(tickets.slice(0, perPageLimit));
    setLimit(perPageLimit);
  }, [tickets, filterTransplants, sortedBy]);

  function loadMore() {
    const newLimit = limit + perPageLimit;

    setTicketsState((prev) => [...prev, ...tickets.slice(limit, newLimit)]);
    dispatch(setLimit(newLimit));

    if (newLimit >= tickets.length) {
      dispatch(fetchTickets());
    }
  }

  if (status === "pending") {
    return <Spin size="large" />;
  }

  if (status === "rejected") {
    return (
      <Alert
        message="Error"
        type="error"
        onClick={() => dispatch(fetchTickets())}
        action={<Button>Повторить запрос</Button>}
      />
    );
  }
  return (
    <>
      {ticketsDeferred.map((ticket) => (
        <TicketCard
          key={uuidv4()}
          price={ticket.price}
          carrier={ticket.carrier}
          segments={ticket.segments}
        />
      ))}
      <Button type="primary" onClick={loadMore}>
        Загрузить еще 5 билетов
      </Button>
    </>
  );
};

export default TicketList;
