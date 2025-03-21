import { Alert, Button, Spin } from "antd"
import React, { useDeferredValue, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { fetchTickets } from "../../store/ticketsSlice"
import { Tickets } from "../../types/Tickets"
import { useAppDispatch, useAppSelector } from "../../utils/store/redux"
import TicketCard from "../TicketCard"

const TicketList = () => {
  const { tickets: {tickets, status}, options: {filterTransplants, sortedBy} } = useAppSelector(state=>state)
  const dispatch = useAppDispatch()

  const [lastIndex, setLastIndex] = useState(0)
  const [ticketsState, setTicketsState] = useState<Tickets[]>(
    tickets.slice(0, 5)
  )
  const ticketsDeferred = useDeferredValue(ticketsState)

  useEffect(() => {
    setTicketsState(tickets.slice(0, 5))
    setLastIndex((prev) => prev + 5)
    
  }, [tickets, filterTransplants, sortedBy])

  function loadMore() {
    setTicketsState((prev) => [
      ...prev,
      ...tickets.slice(lastIndex, lastIndex + 5),
    ])
    setLastIndex((prev) => prev + 5)
  }

  if (status === "pending") {
    return <Spin size="large" />
  }

  if (status === "rejected") {
    return (
      <Alert
        message="Error"
        type="error"
        onClick={() => dispatch(fetchTickets())}
        action={<Button>Повторить запрос</Button>}
        
      />
    )
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
  )
}

export default TicketList
