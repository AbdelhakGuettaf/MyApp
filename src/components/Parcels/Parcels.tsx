import { View } from "native-base";
import { getDataStatic } from "../../app/utils";
import React from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Parcel } from "./Parcel";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addParcel, editParcelStat, ParcelType, reset } from "./ParcelsSlice";
import { addUnconParcel } from "./UnconfirmedParcels.slice";

interface ParcelsProps {
  status:
    | "all"
    | "active"
    | "Awaiting Confirmation"
    | "Awaiting Pickup"
    | "Delivery in Progress"
    | "Delivery Complete"
    | "";
}

export const Parcels: React.FC<ParcelsProps> = ({ status }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useAppDispatch();
  const { UserInfo } = useAppSelector((state) => state);
  const onRefresh = React.useCallback(() => {
    if (UserInfo.admin || UserInfo.type === "Store Account") return;
    setRefreshing(true);
    dispatch(reset());
    getDataStatic().then((parcel) => {
      parcel.map((parcel) => {
        parcel.status === "Awaiting Confirmation"
          ? dispatch(addUnconParcel(parcel))
          : dispatch(addParcel(parcel));
      });
    });
    setRefreshing(false);
  }, []);

  let parcels: ParcelType[] = [];
  if (status !== "all" && status !== "active") {
    parcels = useAppSelector((state) =>
      state.Parcels.filter((parcel) => parcel.status == status)
    );
  }

  if (status === "all") {
    parcels = useAppSelector((state) => state.Parcels);
  }
  if (status === "Awaiting Confirmation") {
    parcels = useAppSelector((state) => state.UnconfirmedParcels);
  }
  if (status === "active") {
    parcels = useAppSelector((state) =>
      state.Parcels.filter(
        (parcel) =>
          parcel.status !== "Delivery Complete" && parcel.status !== ""
      )
    );
  }
  return (
    <ScrollView
      refreshControl={
        status === "Awaiting Confirmation" ? (
          <></>
        ) : (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        )
      }
    >
      {parcels.map((item, idx) => (
        <Parcel key={idx} parcel={item} />
      ))}
    </ScrollView>
  );
};
