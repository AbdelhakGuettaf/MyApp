import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: userData = {
  parcels: [],
  admin: false,
  uid: "",
  phoneNumber: "",
  name: "",
  type: "",
};

type userData = {
  parcels: string[];
  admin: boolean;
  type: string;
  store?: string;
  storeAddress?: string;
  uid: string;
  phoneNumber: string;
  name: string;
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
    setUserInfo: (
      state,
      action: PayloadAction<{
        name: string;
        phoneNumber: string;
        type: string;
        store: string;
        storeAddress: string;
      }>
    ) => {
      state.type = action.payload.type;
      state.store = action.payload.store;
      state.storeAddress = action.payload.storeAddress;
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
    },
  },
});

export const {
  setUserPerm,
  setUserID,
  setParcels,
  updateParcels,
  setUserInfo,
} = userInfo.actions;

export default userInfo.reducer;
