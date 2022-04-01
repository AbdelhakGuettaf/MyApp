import { UsersProps } from "./ScreenProps";
import React from "react";
import { Dispatchers } from "../components/Dispatchers/Dispatchers";

const UsersScreen: React.FC<UsersProps> = ({ navigation, route }) => {
  return (
    <>
      <Dispatchers />
    </>
  );
};

export default UsersScreen;
