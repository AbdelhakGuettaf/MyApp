import React, { useState } from "react";
import { DispatcherType } from "./Dispatchers.slice";
import { MaterialIcons, Octicons, FontAwesome5 } from "@expo/vector-icons";
import {
  Heading,
  HStack,
  Text,
  View,
  Modal,
  Button,
  Pressable,
} from "native-base";
import { callNumber } from "../../app/utils";
import { useAppSelector } from "../../app/hooks";
import { Parcel } from "../Parcels/Parcel";

interface DispatcherProps {
  user: DispatcherType;
}

export const Dispatcher: React.FC<DispatcherProps> = ({
  user: { firstName, lastName, phoneNumber, id, accountType, parcels },
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const Parcels = useAppSelector((state) => state.Parcels);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  function getDebt() {
    return Parcels.filter(
      (parcel) =>
        parcel.deliveredBy === id &&
        parcel.status !== "Payed" &&
        parcel.status !== "Awaiting Pickup"
    ).reduce((curr, parcel) => {
      return curr + parseInt(parcel.paymentValue);
    }, 0);
  }
  return (
    <>
      <Pressable onPress={() => toggleModal()}>
        <View
          bg="white"
          m="1.5"
          borderRadius="lg"
          paddingY="3"
          paddingX="2"
          shadow="3"
        >
          <HStack>
            <View marginY="auto" maxW={"1/5"}>
              {accountType === "Store Account" ? (
                <FontAwesome5 name="store-alt" size={35} color="tomato" />
              ) : (
                <Octicons name="person" size={55} color="tomato" />
              )}
            </View>
            <View
              justifyContent={"center"}
              flexGrow="1"
              maxWidth={"1/2"}
              mx="2"
            >
              <Heading fontSize="md" marginLeft={15} isTruncated>
                {firstName + " " + lastName}
              </Heading>
              <Text marginLeft={15}>{getDebt()}</Text>
            </View>
            <View justifyContent={"center"} flexGrow="0">
              <Pressable
                onPress={() => callNumber(phoneNumber)}
                p="0.5"
                bg={"green.600"}
                borderRadius={"md"}
              >
                <HStack p="0.5">
                  <MaterialIcons name="call" size={20} color="black" />
                  <Text fontSize={"sm"} color="white">
                    {phoneNumber}
                  </Text>
                </HStack>
              </Pressable>
            </View>
          </HStack>
        </View>
      </Pressable>

      <Modal isOpen={modalVisible} onClose={toggleModal} size="full">
        <Modal.Content maxH="3/4">
          <Modal.CloseButton />
          <Modal.Header>
            <Heading fontSize={"xl"} maxW={"4/5"}>
              {firstName + " " + lastName}
            </Heading>
          </Modal.Header>
          <Modal.Body p="0">
            {Parcels.map((parcel, key) => {
              if (parcel.deliveredBy === id)
                return <Parcel key={key} parcel={parcel} />;
            })}
          </Modal.Body>
          <Modal.Footer flexDirection={"row"}>
            <View alignSelf={"flex-start"} flexGrow="1"></View>
            <Button.Group space={2}>
              <Button
                bgColor={"tomato"}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Ok
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};
