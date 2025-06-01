import { createSlice } from "@reduxjs/toolkit";
import { fsApi } from "../api/apiSlice";

const initialState = {
  currentGroup: null,
  balances: [],
  expenses: [],
  settlements: [],
  history: [],
  selectedItem: null,
  detailsOpen: false,
  isLoading: false,
  error: null,
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setDetailsOpen: (state, action) => {
      state.detailsOpen = action.payload;
    },
    clearGroupData: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle group data fetching
      .addMatcher(fsApi.endpoints.getGroupInfo.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        fsApi.endpoints.getGroupInfo.matchFulfilled,
        (state, { payload }) => {
          state.currentGroup = payload;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        fsApi.endpoints.getGroupInfo.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error.message;
        }
      )
      // Handle balances fetching
      .addMatcher(
        fsApi.endpoints.getGroupBalances.matchFulfilled,
        (state, { payload }) => {
          state.balances = payload;
        }
      )
      // Handle expenses fetching
      .addMatcher(
        fsApi.endpoints.getGroupExpenses.matchFulfilled,
        (state, { payload }) => {
          state.expenses = payload;
        }
      )
      // Handle settlements fetching
      .addMatcher(
        fsApi.endpoints.getGroupSettlements.matchFulfilled,
        (state, { payload }) => {
          state.settlements = payload;
        }
      )
      // Handle history fetching
      .addMatcher(
        fsApi.endpoints.getGroupHistory.matchFulfilled,
        (state, { payload }) => {
          state.history = payload;
        }
      );
  },
});

export const { setSelectedItem, setDetailsOpen, clearGroupData } =
  groupSlice.actions;

export const selectCurrentGroup = (state) => state.group.currentGroup;
export const selectBalances = (state) => state.group.balances;
export const selectExpenses = (state) => state.group.expenses;
export const selectSettlements = (state) => state.group.settlements;
export const selectHistory = (state) => state.group.history;
export const selectSelectedItem = (state) => state.group.selectedItem;
export const selectDetailsOpen = (state) => state.group.detailsOpen;
export const selectIsLoading = (state) => state.group.isLoading;
export const selectError = (state) => state.group.error;

export default groupSlice.reducer;
