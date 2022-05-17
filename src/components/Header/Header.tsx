import { View, Text, HStack } from "native-base";
import React, { ReactElement } from "react";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../app/hooks";
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const STATE = useAppSelector((state) => state);
  const { UserInfo } = STATE;
  const TYPE = UserInfo.type === "Store Account" ? true : false;
  return (
    <View h={"8%"} bgColor="tomato" px="3">
      <HStack my="auto">
        {TYPE ? (
          <FontAwesome5 name="store-alt" size={35} color="white" />
        ) : (
          <AntDesign name="user" size={50} color="white" />
        )}
        <Text my="auto" color="white" fontSize="2xl" ml="2">
          {TYPE
            ? "Store Account"
            : UserInfo.admin
            ? "Admin Account"
            : "Delivery Account"}
        </Text>
      </HStack>
    </View>
  );
};
