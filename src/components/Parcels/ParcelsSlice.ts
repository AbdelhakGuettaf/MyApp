import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  doc,
  setDoc,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../app/firebaseConfig";

export type ParcelType = {
  id: string;
  parcelName: string;
  description: string;
  destination: string;
  paymentValue: string;
  createdAt: string;
  phoneNumber: string;
  status: string;
  tracking: string;
  icon: string;
  color: string;
  deliveredBy: string;
};

const initialState: ParcelType[] = [];

export const updateStatus = createAsyncThunk(
  "Parcels/updateStatus",
  async (parcel: ParcelType) => {
    let newStatus = "";
    let newIcon = "";
    let newColor = "";
    switch (parcel.status) {
      case "Awaiting Confirmation":
        newStatus = "Awaiting Pickup";
        newIcon = "hand-holding";
        newColor = "#d97706";
        await setDoc(doc(db, "parcels", parcel.id), parcel);

        await deleteDoc(doc(collection(db, "unConfirmedParcels"), parcel.id));
        break;
      case "Awaiting Pickup":
        newStatus = "Delivery in Progress";
        newIcon = "truck";
        newColor = "#facc15";
        break;
      case "Delivery in Progress":
        newStatus = "Delivery Complete";
        newIcon = "check";
        newColor = "#16a34a";
        break;
      case "Delivery Complete":
        break;
    }
    let newParcel = {
      ...parcel,
      color: newColor,
      icon: newIcon,
      status: newStatus,
    };
    const DOC_REF = doc(db, "parcels", parcel.id);
    await updateDoc(DOC_REF, {
      color: newColor,
      icon: newIcon,
      status: newStatus,
    });

    return newParcel;
  }
);

export const ParcelSlice = createSlice({
  name: "Parcels",
  initialState,
  reducers: {
    addParcel: (state, action: PayloadAction<ParcelType>) => {
      let checker = true;
      state.map((parcel) => {
        if (parcel.tracking === action.payload.tracking)
          return (checker = false);
      });
      if (checker) state.push(action.payload);
    },
    editParcelStat: (state, action: PayloadAction<ParcelType>) => {
      state.map((parcel, index) => {
        if (parcel.id === action.payload.id) {
          parcel.icon = action.payload.icon;
          parcel.color = action.payload.color;
          parcel.status = action.payload.status;
        }
      });
    },
  },
  extraReducers: (buider) => {
    buider.addCase(updateStatus.fulfilled, (state, action) => {
      state.map((parcel) => {
        if (parcel.id === action.payload.id) {
          parcel.color = action.payload.color;
          parcel.icon = action.payload.icon;
          parcel.status = action.payload.status;
        }
      });
    });
    buider.addCase(updateStatus.rejected, (state, action) => {
      console.log(action.error);
    });
  },
});

export const { addParcel, editParcelStat } = ParcelSlice.actions;

export default ParcelSlice.reducer;
