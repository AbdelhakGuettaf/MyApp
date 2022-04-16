import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParcelType } from "./ParcelsSlice";

const initialState: ParcelType[] = [];

export const UnconfirmedParcelSlice = createSlice({
  name: "Parcels",
  initialState,
  reducers: {
    addUnconParcel: (state, action: PayloadAction<ParcelType>) => {
      let checker = true;
      state.map((parcel) => {
        if (parcel.id === action.payload.id) return (checker = false);
      });
      if (checker) state.push(action.payload);
    },
    resetUncon: (state) => (state = initialState),
  },
});

export const { addUnconParcel, resetUncon } = UnconfirmedParcelSlice.actions;

export default UnconfirmedParcelSlice.reducer;
