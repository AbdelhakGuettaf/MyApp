import { Parcels } from "../components/Parcels/Parcels";
import { MyParcelsProps } from "./ScreenProps";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";

import {
  Button,
  Center,
  CheckIcon,
  FormControl,
  Heading,
  HStack,
  Input,
  InputRightAddon,
  Modal,
  Select,
  Text,
  TextArea,
  WarningOutlineIcon,
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";

const MyParcels: React.FC<MyParcelsProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const STATE = useAppSelector((state) => state);
  const [filter, setFilter] = useState<
    | "active"
    | "all"
    | "Awaiting Confirmation"
    | "Awaiting Pickup"
    | "Delivery in Progress"
    | "Delivery Complete"
  >("active");

  return (
    <>
      <Select
        placeholder="Filter Parcels"
        fontSize={"md"}
        textAlign="center"
        color={"gray.500"}
        borderRadius="md"
        onValueChange={(text: any) => setFilter(text)}
        dropdownIcon={
          <AntDesign
            name="caretdown"
            style={{ marginRight: 15 }}
            size={15}
            color="gray"
          />
        }
      >
        <Select.Item label="Active Parcels" value="active" />
        <Select.Item label="All Parcels" value="all" />
        <Select.Item label="Confirmed Parcels" value="Awaiting Pickup" />
        <Select.Item label="In Progress" value="Delivery in Progress" />
        <Select.Item label="Completed" value="Delivery Complete" />
      </Select>
      <Parcels status={filter} />
    </>
  );
};

export default MyParcels;
