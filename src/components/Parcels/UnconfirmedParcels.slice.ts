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
        if (parcel.tracking === action.payload.tracking)
          return (checker = false);
      });
      if (checker) state.push(action.payload);
    },
    reset: () => initialState,
  },
});

export const { addUnconParcel, reset } = UnconfirmedParcelSlice.actions;

export default UnconfirmedParcelSlice.reducer;
