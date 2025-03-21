import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import optionsSlice from "./optionsSlice"
import ticketsSlice from "./ticketsSlice"

const rootReducer = combineReducers({
  tickets: ticketsSlice.reducer,
  options: optionsSlice.reducer,
})
export const store = configureStore({ reducer: rootReducer })
