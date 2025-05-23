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

  const perPageLimit = 10;

  const [ticketsState, setTicketsState] = useState<Tickets[]>(
    tickets.slice(0, perPageLimit),
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
  if (ticketsDeferred.length === 0) {
    return <Alert message="Ничего не найдено" type="info" />;
  }
  return (
    <>
      {status === "pending" && <Spin size="large" />}
      {ticketsDeferred.map((ticket) => (
        <TicketCard
          key={uuidv4()}
          price={ticket.price}
          carrier={ticket.carrier}
          segments={ticket.segments}
        />
      ))}
      <Button type="primary" onClick={loadMore}>
        Загрузить еще {perPageLimit} билетов
      </Button>
    </>
  );
};

export default TicketList;
