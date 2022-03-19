import { configureStore } from "@reduxjs/toolkit";
import AuthStackSlice from "../components/AuthStack/AuthStackSlice";
import ParcelsSlice from "../components/Parcels/ParcelsSlice";
import UnconfirmedParcelsSlice from "../components/Parcels/UnconfirmedParcels.slice";
import UserInfo from "../app/user.slice";

export const store = configureStore({
  reducer: {
    AuthStackForm: AuthStackSlice,
    Parcels: ParcelsSlice,
    UserInfo: UserInfo,
    UnconfirmedParcels: UnconfirmedParcelsSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
