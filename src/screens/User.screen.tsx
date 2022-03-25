import {
  addDispatcher,
  DispatcherType,
} from "../components/Dispatchers/Dispatchers.slice";
import { UsersProps } from "./ScreenProps";
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
import { getData, getUsers } from "../app/utils";
import { Dispatchers } from "../components/Dispatchers/Dispatchers";

const UsersScreen: React.FC<UsersProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const STATE = useAppSelector((state) => state);
  const [filter, setFilter] = useState();

  useEffect(() => {
    getUsers().then((res) =>
      res.map((user) => dispatch(addDispatcher(user as DispatcherType)))
    );
  }, []);

  return (
    <>
      <Dispatchers />
    </>
  );
};

export default UsersScreen;
