import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: userData = {
  parcels: [],
  admin: false,
  uid: "",
};

type userData = {
  parcels: string[];
  admin: boolean;
  uid: string;
};

export const userInfo = createSlice({
  name: "userPerm",
  initialState,
  reducers: {
    setUserPerm: (state) => {
      state.admin = true;
    },
    setUserID: (state, action) => {
      state.uid = action.payload;
    },
    setParcels: (state, action: PayloadAction<string[]>) => {
      state.parcels = action.payload;
    },
    updateParcels: (state, action: PayloadAction<string>) => {
      state.parcels.push(action.payload);
    },
  },
});

export const { setUserPerm, setUserID, setParcels, updateParcels } =
  userInfo.actions;

export default userInfo.reducer;
