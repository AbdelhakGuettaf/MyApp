import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { SettingsProps } from "./ScreenProps";
import { getAuth } from "firebase/auth";
import {
  View,
  Button,
  Divider,
  Heading,
  HStack,
  Modal,
  Pressable,
  Text,
  ScrollView,
} from "native-base";
import Register from "../components/AuthStack/Register";
import { useAppSelector } from "../app/hooks";
import { AntDesign } from "@expo/vector-icons";

const SettingsScreen: React.FC<SettingsProps> = ({ navigation, route }) => {
  const auth = getAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const state = useAppSelector((state) => state);

  const countEstPayment = () => {
    let sum = 0;
    state.Parcels.map((parcel) => {
      if (
        parcel.status === "Awaiting Confirmation" ||
        parcel.status === "Awaiting Pickup" ||
        parcel.status === "Payed"
      )
        return;
      sum = sum + parseInt(parcel.paymentValue);
    });

    return sum;
  };

  return (
    <>
      <ScrollView p="2">
        <View p="3" bg="white" rounded={"lg"} mb="4" shadow={"7"}>
          <View
            alignSelf={"center"}
            rounded={"full"}
            borderColor="black"
            borderWidth={1}
            w="100"
            overflow={"hidden"}
          >
            <AntDesign name="user" size={100} color="black" />
          </View>
          <Heading alignSelf={"center"}>{state.UserInfo.name}</Heading>
        </View>
        <View p="3" bg="white" rounded={"lg"} mb="4" shadow={"7"}>
          <HStack bgColor={"white"} rounded="none" p="2">
            <Text fontWeight={"bold"}>My Phone Number: </Text>
            <Text>{state.UserInfo.phoneNumber}</Text>
          </HStack>
          <Divider />
          <HStack bgColor={"white"} rounded="none" p="2">
            <Text fontWeight={"bold"}>Account Type: </Text>
            <Text>{state.UserInfo.admin ? " Admin" : state.UserInfo.type}</Text>
          </HStack>
          <Divider />
          <HStack bgColor={"white"} rounded="none" p="2">
            <Text fontWeight={"bold"}>Parcel count: </Text>
            <Text>{state.Parcels.length}</Text>
          </HStack>
          {state.UserInfo.admin && (
            <>
              <Divider />
              <HStack bgColor={"white"} rounded="none" p="2">
                <Text fontWeight={"bold"}>User count: </Text>
                <Text>{state.Dispatchers.length}</Text>
              </HStack>
            </>
          )}

          <Divider />
          <HStack bgColor={"white"} rounded="none" p="2">
            <Text fontWeight={"bold"}>Estimated Pending Payment: </Text>
            <Text>{countEstPayment()}</Text>
          </HStack>
        </View>
        <Pressable
          bgColor={"danger.400"}
          rounded="lg"
          p="2"
          borderColor={"blueGray.500"}
          borderBottomWidth="0.5"
          onPress={() => auth.signOut()}
        >
          <Text textAlign={"center"} color="white">
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
      {state.UserInfo.admin && (
        <Pressable
          style={{
            alignSelf: "center",
            backgroundColor: "rgba(256, 256, 256, 1)",

            padding: 12,
            borderRadius: 50,
            marginBottom: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      )}
      <Modal isOpen={modalVisible} onClose={toggleModal} size="full">
        <Modal.Content maxH="3/4">
          <Modal.CloseButton />
          <Modal.Header>
            <Heading fontSize={"xl"} maxW={"4/5"}>
              Add User
            </Heading>
          </Modal.Header>
          <Modal.Body p="0">
            <Register />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};
export default SettingsScreen;
