import { SortType } from "../types/SortedOptions";
import { Tickets } from "../types/Tickets";

export class AviasalesApi {
  static imgUrl = "//pics.avs.io/99/36";
  static baseUrl = "https://aviasales-test-api.kata.academy";

  static async fetchTickets(
    searchId: string,
    { sort, transplants }: { sort: SortType; transplants: number[] },
  ): Promise<{ tickets: Tickets[]; stop: boolean }> {
    let result: Array<Tickets> = [];

    async function recursiveGetTickets() {
      try {
        const response: { tickets: Array<Tickets>; stop: boolean } =
          await fetch(
            AviasalesApi.baseUrl + "/tickets?searchId=" + searchId,
          ).then((response) => response.json());

        // if (response.stop) {
        //   return true
        // } else {
        //   result = [...result, ...response.tickets]
        //   await recursiveGetTickets()
        //   return true
        // }

        if (!response.stop) {
          result = [...result, ...response.tickets];
          // await recursiveGetTickets()
        }
        return response.stop;
      } catch (error) {
        await recursiveGetTickets();
        return false;
      }
    }

    const stop = await recursiveGetTickets();

    // let filteredTickets: Array<Tickets> = this.applyFilters(result, {
    //   sort,
    //   transplants,
    // })

    return { tickets: result, stop: stop };
  }

  static applyFilters(
    tickets: Tickets[],
    {
      transplants,
      sort,
    }: {
      transplants: number[];
      sort: SortType;
    },
  ) {
    const filteredTickets = this.filterTickets(tickets, transplants);

    const sortedTickets = this.sortTickets(filteredTickets, sort);

    return sortedTickets;
  }

  static sortTickets(tickets: Array<Tickets>, sort: SortType) {
    switch (sort) {
      case "cheap":
        tickets.sort((a, b) => a.price - b.price);
        break;
      case "fast":
        tickets.sort((a, b) => {
          const totalDurationA = a.segments.reduce(
            (acc, segment) => acc + segment.duration,
            0,
          );
          const totalDurationB = b.segments.reduce(
            (acc, segment) => acc + segment.duration,
            0,
          );
          return totalDurationA - totalDurationB;
        });
        break;
    }
    return tickets;
  }

  static filterTickets(tickets: Array<Tickets>, transplants: number[]) {
    if (transplants.length > 0) {
      tickets = tickets.filter((ticket) => {
        return ticket.segments.some((item) =>
          transplants.some((option) => item.stops.length === option),
        );
      });
    }
    return [...tickets];
  }

  static async fetchSearchId() {
    return await fetch(this.baseUrl + "/search").then((response) =>
      response.json(),
    );
  }
}
