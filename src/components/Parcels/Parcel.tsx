import React, { useEffect, useState } from "react";
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
import { ParcelType, deleteParcel } from "./ParcelsSlice";
import { callNumber, confirmParcel, deleteParcelFromDB } from "../../app/utils";
import { updateStatus } from "./ParcelsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Alert } from "react-native";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../app/firebaseConfig";
import { userInfo } from "../../app/user.slice";

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
    color: checkColor,
    local,
    storeAddress,
    storePhoneNumber,
    storeName,
  },
}) => {
  const dispatch = useAppDispatch();
  const UserInfo = useAppSelector((state) => state.UserInfo);
  const Dispatchers = useAppSelector((state) => state.Dispatchers);
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
      case "Payed":
        return "success.600";
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
        if (UserInfo.admin) {
          return (result = "Recieved Payment!");
        }
        result = "Ok";
        break;
      default:
        return "Back";
    }
    return result;
  };
  const showConfirmDialog = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete this parcel?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            deleteParcelFromDB(parcel);
            setModalVisible(false);
            dispatch(deleteParcel(parcel.id));
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };
  let color;
  if (checkColor === "") {
    color = "white";
  } else {
    color = checkColor;
  }
  const DeleteButton = () => {
    if (UserInfo.admin) {
      return (
        <Button
          p="1"
          bgColor={"warning.700"}
          onPress={() => {
            showConfirmDialog();
          }}
        >
          Delete
        </Button>
      );
    }
    if (UserInfo.type === "Store Account" && local) {
      if (status === "Awaiting Confirmation" || status === "Awaiting Pickup")
        return (
          <Button
            p="1"
            bgColor={"warning.700"}
            onPress={() => {
              showConfirmDialog();
            }}
          >
            Delete
          </Button>
        );
    }
    return <></>;
  };
  return (
    <>
      <Pressable onPress={() => toggleModal()}>
        <View
          bg="white"
          m="1.5"
          borderRadius="lg"
          paddingY="2"
          paddingX="1.5"
          shadow="3"
        >
          <HStack width={"full"} overflow="hidden">
            <View marginY="auto" maxW={"1/5"}>
              {local ? (
                <FontAwesome5 name="store" size={40} color="tomato" />
              ) : (
                <Octicons name="package" size={55} color="tomato" />
              )}
            </View>

            <VStack marginLeft="2" flexGrow={1} maxW={"3/5"}>
              <HStack>
                <Heading fontSize="md" isTruncated>
                  {local ? storeName : parcelName}
                </Heading>
              </HStack>
              {local ? (
                <VStack>
                  <Text fontSize="xs" color="gray.500">
                    Address : {storeAddress}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    To : {parcelName}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Date: {createdAt}
                  </Text>
                </VStack>
              ) : (
                <VStack>
                  <Text fontSize="xs" color="gray.500">
                    To : {destination}
                  </Text>
                  <HStack>
                    <Text fontSize="xs" color="gray.500">
                      Date: {createdAt}
                    </Text>
                    <Text
                      bg="tomato"
                      borderRadius="sm"
                      paddingX="0.5"
                      color="white"
                      fontSize="xs"
                      marginLeft="1"
                    >
                      {paymentValue} DA
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    {tracking}
                  </Text>
                </VStack>
              )}
            </VStack>
            <View m="auto" flexGrow={0}>
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
            {local ? (
              <>
                <Text isTruncated maxW={"4/5"}>
                  Store: {storeName}
                </Text>
                <Divider my="1" />
                <Text isTruncated maxW={"4/5"}>
                  Address: {storeAddress}
                </Text>
              </>
            ) : (
              <>
                <Text isTruncated maxW={"4/5"}>
                  Recepient Name: {parcelName}
                </Text>
                <Divider my="1" />
                <Text>Destination: {destination}</Text>
              </>
            )}

            <Divider my="1" />
            <Text>Date: {createdAt}</Text>
            <Divider my="1" />
            <Text>
              Delivered by:
              <Text color={"info.600"} fontWeight="bold">
                {Dispatchers.map((dispatcher) => {
                  if (dispatcher.id === parcel.deliveredBy)
                    return (
                      " " + dispatcher.firstName + " " + dispatcher.lastName
                    );
                })}
              </Text>
            </Text>
            <Divider my="1" />
            <View>
              <HStack>
                <Text>Status: </Text>
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
            <Button.Group space={"1"}>
              <Button
                p="1"
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              {local ? (
                <Button
                  p="1"
                  leftIcon={
                    local ? (
                      <FontAwesome5 name="store" size={20} color="white" />
                    ) : (
                      <MaterialIcons name="call" size={20} color="black" />
                    )
                  }
                  bgColor={"green.600"}
                  onPress={() => {
                    storePhoneNumber && callNumber(storePhoneNumber);
                  }}
                >
                  {storePhoneNumber}
                </Button>
              ) : (
                <Button
                  p="1"
                  leftIcon={
                    <MaterialIcons name="call" size={20} color="black" />
                  }
                  bgColor={"green.600"}
                  onPress={() => {
                    callNumber(phoneNumber);
                  }}
                >
                  {phoneNumber}
                </Button>
              )}
              {<DeleteButton />}
              <Button
                p="1.5"
                bgColor={"tomato"}
                onPress={() => {
                  setModalVisible(false);
                  if (UserInfo.type === "Store Account") return; //Store accounts cannot update status
                  if (
                    parcel.status === "Awaiting Confirmation" &&
                    UserInfo.admin
                  )
                    // admin cannot accept deliveries
                    return;

                  if (
                    parcel.status === "Delivery Complete" &&
                    !UserInfo.admin
                  ) {
                    // if delivery is compelete only an admin can update status
                    setModalVisible(false);
                    return;
                  }

                  dispatch(updateStatus(parcel)); //Thunkfunction that updates the parcel to the next status
                  if (parcel.status === "Awaiting Confirmation") {
                    confirmParcel(parcel); //This function adds the parcel id to the parcels array in the userData
                  }
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
