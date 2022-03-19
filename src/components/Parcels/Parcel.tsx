import React, { useState } from "react";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import {
  Center,
  Heading,
  HStack,
  Spinner,
  Text,
  View,
  VStack,
  Modal,
  ScrollView,
  Button,
  Pressable,
  Divider,
} from "native-base";
import { ParcelType } from "./ParcelsSlice";
import { callNumber, confirmParcel } from "../../app/utils";
import { updateStatus } from "./ParcelsSlice";
import { useAppDispatch } from "../../app/hooks";

interface ParcelProps {
  parcel: ParcelType;
}

export const Parcel: React.FC<ParcelProps> = ({
  parcel,
  parcel: {
    parcelName,
    paymentValue,
    description,
    phoneNumber,
    destination,
    createdAt,
    status,
    tracking,
    icon,
    color,
  },
}) => {
  const dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const statusModalField = () => {
    switch (status) {
      case "Awaiting Confirmation":
        return "info.500";
      case "Awaiting Pickup":
        return "amber.600";
      case "Delivery in Progress":
        return "yellow.400";
      case "Delivery Complete":
        return "success.600";
      default:
        return "Black";
    }
  };
  const modalButtonName = () => {
    let result: string;
    switch (status) {
      case "Awaiting Confirmation":
        result = "Confirm!";
        break;
      case "Awaiting Pickup":
        result = "Picked up!";
        break;
      case "Delivery in Progress":
        result = "Delivered!";
        break;
      case "Delivery Complete":
        result = "Ok";
        break;
      default:
        return "Black";
    }
    return result;
  };
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
              <Octicons name="package" size={55} color="tomato" />
            </View>

            <VStack marginLeft="4" flexGrow={1} maxW={"3/5"}>
              <HStack>
                <Heading fontSize="md" isTruncated>
                  {parcelName}
                </Heading>
              </HStack>
              <HStack>
                <Text marginLeft="2" fontSize="xs" color="gray.500">
                  To : {destination}
                </Text>
                <Text
                  bg="tomato"
                  borderRadius="sm"
                  paddingX="0.5"
                  color="white"
                  fontSize="xs"
                  marginLeft="2"
                >
                  {paymentValue} DA
                </Text>
              </HStack>
              <Text marginLeft="2" fontSize="xs" color="gray.500">
                Date: {createdAt}
              </Text>
              <Text marginLeft="2" fontSize="xs" color="gray.500">
                {tracking}
              </Text>
            </VStack>
            <View marginY="auto" flexGrow={0}>
              <View alignItems={"center"}>
                <FontAwesome5 name={icon} size={30} color={color} />

                <Text
                  marginTop={"3"}
                  fontWeight={"bold"}
                  fontSize="2xs"
                  color={color}
                >
                  {status}
                </Text>
              </View>
            </View>
          </HStack>
        </View>
      </Pressable>
      <Modal isOpen={modalVisible} onClose={toggleModal} size="xl">
        <Modal.Content maxH="360">
          <Modal.CloseButton />
          <Modal.Header>
            <Text isTruncated maxW={"4/5"}>
              Recepient Name: {`   `}
              {parcelName}
            </Text>
            <Divider my="1" />
            <Text>
              Destination: {`   `}
              {destination}
            </Text>
            <Divider my="1" />
            <Text>
              Date: {`   `}
              {createdAt}
            </Text>
            <Divider my="1" />
            <View>
              <HStack>
                <Text>Status:{`   `}</Text>
                <Text fontWeight={"bold"} color={statusModalField()}>
                  {status}
                </Text>
              </HStack>
            </View>
          </Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Text>{description}</Text>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer flexDirection={"row"}>
            <View alignSelf={"flex-start"} flexGrow="1">
              <View alignSelf={"flex-start"} top="2">
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
            </View>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                bgColor={"tomato"}
                onPress={() => {
                  dispatch(updateStatus(parcel));
                  if (parcel.status === "Awaiting Confirmation") {
                    confirmParcel(parcel);
                  }
                  setModalVisible(false);
                }}
              >
                {modalButtonName()}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};
