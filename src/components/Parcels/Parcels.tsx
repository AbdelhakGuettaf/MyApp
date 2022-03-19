import { View } from "native-base";
import { getDataStatic } from "../../app/utils";
import React from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Parcel } from "./Parcel";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { editParcelStat, ParcelType } from "./ParcelsSlice";

interface ParcelsProps {
  status:
    | "all"
    | "active"
    | "Awaiting Confirmation"
    | "Awaiting Pickup"
    | "Delivery in Progress"
    | "Delivery Complete";
}

export const Parcels: React.FC<ParcelsProps> = ({ status }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useAppDispatch();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDataStatic().then((parcels) =>
      parcels.map((parcel) => dispatch(editParcelStat(parcel)))
    );
    setRefreshing(false);
  }, []);

  let parcels: ParcelType[] = [];
  if (status && status !== "all" && status !== "active") {
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
      state.Parcels.filter((parcel) => parcel.status !== "Delivery Complete")
    );
  }
  return (
    <View flexDirection={"column"} bg="blueGray.100" h="full" pt="1">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {parcels.map((item, idx) => (
          <Parcel key={idx} parcel={item} />
        ))}
      </ScrollView>
    </View>
  );
};
