import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DispatcherType = {
  fullName: string;
  parcels: string[];
  phoneNumber: string;
};

const initialState: DispatcherType[] = [];
const DispatcherSlice = createSlice({
  name: "Dispatchers",
  initialState,
  reducers: {
    addDispatcher: (state, action: PayloadAction<DispatcherType>) => {
      if (state.every((user) => user.fullName !== action.payload.fullName)) {
        state.push(action.payload);
      }
    },
  },
});

export const { addDispatcher } = DispatcherSlice.actions;

export default DispatcherSlice.reducer;
