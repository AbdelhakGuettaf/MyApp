import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DispatcherType = {
  admin: boolean;
  firstName: string;
  lastName: string;
  location: string[];
  parcels: string[];
  phoneNumber: string;
  id: string;
};

const initialState: DispatcherType[] = [];
const DispatcherSlice = createSlice({
  name: "Dispatchers",
  initialState,
  reducers: {
    addDispatcher: (state, action: PayloadAction<DispatcherType>) => {
      if (state.every((user) => user.id !== action.payload.id)) {
        if (action.payload.admin) return;
        state.push(action.payload);
      }
    },
  },
});

export const { addDispatcher } = DispatcherSlice.actions;

export default DispatcherSlice.reducer;
