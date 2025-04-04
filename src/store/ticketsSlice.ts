import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AviasalesApi } from "../services/AviasalesApi";
import { Tickets } from "../types/Tickets";
import { AppState, createAppAsyncThunk } from "../utils/store/redux";
import {
  getFilterTransplantsSelector,
  getSearchIdSelector,
  getSortedBySelector,
} from "./optionsSlice";

export const ticketsSelector = (state: AppState) => state.tickets;

export const getOriginTicketsSelector = createSelector(
  ticketsSelector,
  (tickets) => tickets.originTickets,
);

export const fetchTickets = createAppAsyncThunk(
  "tickets/fetchTickets",
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const filterOptions = getFilterTransplantsSelector(state);
    const sortedByOptions = getSortedBySelector(state);

    const searchId = getSearchIdSelector(state);
    const response = await AviasalesApi.fetchTickets(searchId, {
      sort: sortedByOptions,
      transplants: filterOptions,
    });
    return response;
  },
);

export const applyFilters = createAppAsyncThunk(
  "tickets/applyFilters",
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const filterOptions = getFilterTransplantsSelector(state);
    const sortedByOptions = getSortedBySelector(state);
    const tickets = getOriginTicketsSelector(state);

    const response = AviasalesApi.applyFilters(tickets, {
      sort: sortedByOptions,
      transplants: filterOptions,
    });
    return response;
  },
);

export interface TicketsState {
  status: "pending" | "fulfilled" | "rejected";
  tickets: Array<Tickets>;
  originTickets: Array<Tickets>;
  stop: boolean;
}

const defaultState: TicketsState = {
  status: "pending",
  tickets: [],
  stop: false,
  originTickets: [],
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: defaultState,
  reducers: {
    getTickets(state) {
      return state;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchTickets.pending, (state) => ({
        ...state,
        status: "pending",
      }))
      .addCase(fetchTickets.fulfilled, (state, action) => {
        const res =
          state.tickets.length > 0
            ? [...state.tickets, ...action.payload.tickets]
            : action.payload.tickets;
        return {
          ...state,
          status: "fulfilled",
          originTickets: res,
          tickets: res,
          stop: action.payload.stop,
        };
      })
      .addCase(fetchTickets.rejected, (state) => ({
        ...state,
        status: "rejected",
      }))
      .addCase(applyFilters.fulfilled, (state, action) => ({
        ...state,
        tickets: action.payload,
      })),
});

export const { getTickets } = ticketsSlice.actions;

export default ticketsSlice;
