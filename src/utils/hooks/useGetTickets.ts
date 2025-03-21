import { fetchTickets } from "../../store/ticketsSlice"
import { useAppDispatch, useAppSelector } from "../store/redux"

const useGetTickets = () => {
  const dispatch = useAppDispatch()
  const { tickets, stop, status } = useAppSelector((state) => state.tickets)

  function loopGetTickets() {
    console.log('loop get tickets');
    

    if (stop) return

    setTimeout(() => {
      dispatch(fetchTickets())
      loopGetTickets()
    }, 5000)
  }

  loopGetTickets()
  return { tickets, status }
}

export default useGetTickets
