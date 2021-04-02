import { createSlice } from '@reduxjs/toolkit';

export const domainSlice = createSlice({
  name: 'domain',
  initialState: {
    domains: [],
  },
  reducers: {
    add: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.domains.unshift(action.payload);
    },
    update: (state, { payload }) => {
      const index = state.domains.findIndex(domain => domain.name === payload.name && domain.type === payload.type)
      if (index > -1) {
        state.domains[index].cloudflare = payload.cloudflare
      }
    },
    remove: (state, { payload }) => {
      const index = state.domains.findIndex(domain => domain.name === payload.name && domain.type === payload.type)
      if (index > -1) {
        state.domains.splice(index, 1)
      }
    }
  },
});

export const { add, remove, update } = domainSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const domains = state => state.domains;

export default domainSlice.reducer;
