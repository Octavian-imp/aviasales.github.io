import { SortType } from "../types/SortedOptions";
import { Tickets } from "../types/Tickets";

export class AviasalesApi {
  static imgUrl = "//pics.avs.io/99/36"
  static baseUrl = "https://aviasales-test-api.kata.academy"

  static async fetchTickets(
    searchId: string,
    { sort, transplants }: { sort: SortType; transplants: number[] }
  ): Promise<{ tickets: Tickets[]; stop: boolean }> {
    const result: { tickets: Array<Tickets>; stop: boolean } = await fetch(
      this.baseUrl + "/tickets?searchId=" + searchId
    ).then((response) => response.json())

    
    let filteredTickets: Array<Tickets> = this.applyFilters(result.tickets, {
      sort,
      transplants,
    })
    

    return { tickets: filteredTickets, stop: result.stop }
  }

  static applyFilters(
    tickets: Tickets[],
    {
      transplants,
      sort,
    }: {
      transplants: number[]
      sort: SortType
    }
  ) {
    const filteredTickets = this.filterTickets(tickets, transplants)
    
    const sortedTickets = this.sortTickets(filteredTickets, sort)
    
    return sortedTickets
  }

  static sortTickets(tickets: Array<Tickets>, sort: SortType) {
    switch (sort) {
      case "cheap":
        tickets.sort((a, b) => a.price - b.price)
        break
      case "fast":
        tickets.sort((a, b) => {
          const totalDurationA = a.segments.reduce(
            (acc, segment) => acc + segment.duration,
            0
          )
          const totalDurationB = b.segments.reduce(
            (acc, segment) => acc + segment.duration,
            0
          )
          return totalDurationA - totalDurationB
        })
        break
    }
    return tickets
  }

  static filterTickets(tickets: Array<Tickets>, transplants: number[]) {
    if (transplants.length > 0) {
      tickets = tickets.filter((ticket) =>
        ticket.segments.some((item) =>
          transplants.some((option) => item.stops.length === option)
        )
      )
    }
    return [...tickets]
  }

  static async fetchSearchId() {
    return await fetch(this.baseUrl + "/search").then((response) =>
      response.json()
    )
  }
}
