import { createSelector, createSlice } from "@reduxjs/toolkit"
import { AviasalesApi } from "../services/AviasalesApi"
import { SortType } from "../types/SortedOptions"
import { AppState, createAppAsyncThunk } from "../utils/store/redux"

type OptionsState = {
  filterTransplants: number[]
  sortedBy: SortType
  searchId: string
}

export const fetchSearchId = createAppAsyncThunk(
  "options/fetchSearchId",
  async (): Promise<{ searchId: string }> => {
    const response = await AviasalesApi.fetchSearchId()
    return response
  }
)

export const optionsSelector = (state: AppState) => state.options

export const getSearchIdSelector = createSelector(
  optionsSelector,
  (options) => options.searchId
)

export const getFilterTransplantsSelector = createSelector(
  optionsSelector,
  (options) => options.filterTransplants
)

export const getSortedBySelector = createSelector(
  optionsSelector,
  (options) => options.sortedBy
)

const defaultState: OptionsState = {
  filterTransplants: [],
  sortedBy: "fast",
  searchId: "",
}

const optionsSlice = createSlice({
  name: "options",
  initialState: defaultState,
  reducers: {
    setFilterTransplants(state, action) {
      state.filterTransplants = action.payload
    },
    setSortedBy(state,action){
      state.sortedBy=action.payload
    }
  },
  extraReducers: (builder) =>
    builder.addCase(fetchSearchId.fulfilled, (state, action) => {
      return {
        ...state,
        searchId: action.payload.searchId,
      }
    }),
})

export const { setFilterTransplants,setSortedBy } = optionsSlice.actions

export default optionsSlice
