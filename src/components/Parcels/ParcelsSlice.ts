import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { doc, setDoc, collection, deleteDoc } from "firebase/firestore";
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
    let newStatus = parcel.status;
    let newIcon = parcel.icon;
    let newColor = parcel.color;
    switch (parcel.status) {
      case "Awaiting Confirmation":
        newStatus = "Awaiting Pickup";
        newIcon = "hand-holding";
        newColor = "#d97706";
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
        newStatus = "Payed";
        newIcon = "";
        break;
    }
    let newParcel = {
      ...parcel,
      color: newColor,
      icon: newIcon,
      status: newStatus,
    };
    const DOC_REF = doc(db, "parcels", parcel.id);
    await setDoc(DOC_REF, newParcel);

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
        if (parcel.id === action.payload.id) return (checker = false);
      });
      if (checker) state.push(action.payload);
    },
    editParcelStat: (state, action: PayloadAction<ParcelType>) => {
      state.map((parcel) => {
        if (parcel.id === action.payload.id) {
          parcel.icon = action.payload.icon;
          parcel.color = action.payload.color;
          parcel.status = action.payload.status;
        }
      });
    },
    deleteParcel: (state, action: PayloadAction<string>) => {
      state.splice(
        state.findIndex((parcel) => parcel.id === action.payload),
        1
      );
    },
    reset: (state) => {
      state = initialState;
    },
  },
  extraReducers: (buider) => {
    buider.addCase(updateStatus.fulfilled, (state, action) => {
      let checker = true;
      state.map((parcel) => {
        if (parcel.id === action.payload.id) {
          parcel.color = action.payload.color;
          parcel.icon = action.payload.icon;
          parcel.status = action.payload.status;
          return (checker = false);
        }
      });
      if (checker) state.push(action.payload);
    });
    buider.addCase(updateStatus.rejected, (state, action) => {
      alert(action.error);
    });
  },
});

export const { addParcel, editParcelStat, deleteParcel, reset } =
  ParcelSlice.actions;

export default ParcelSlice.reducer;
