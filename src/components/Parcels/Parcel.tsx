import React, { useRef, useState } from "react";
import {
  FontAwesome5,
  MaterialIcons,
  Octicons,
  AntDesign,
} from "@expo/vector-icons";
import {
  Heading,
  HStack,
  Text,
  View,
  VStack,
  Modal,
  ScrollView,
  Button,
  Pressable,
  Divider,
  Spinner,
} from "native-base";
import { ParcelType, deleteParcel } from "./ParcelsSlice";
import { callNumber, confirmParcel, deleteParcelFromDB } from "../../app/utils";
import { updateStatus } from "./ParcelsSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Alert, Animated, Vibration } from "react-native";
import { ParcelForm } from "../CreateParcelForm/parcelForm";

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [toggleAddParcelForm, setToggleAddParcelForm] =
    useState<boolean>(false);
  const anim = {
    left: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
  };
  const interpolatedLeft = anim.left.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1.8],
  });
  const showSideButtons = () => {
    if (UserInfo.type === "Delivery Account") return;
    if (!local && UserInfo.type === "Store Account") return;
    const { left, opacity } = anim;
    Animated.timing(left, {
      toValue: 30,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
      }).start();
    });
    setToggle(!toggle);
  };
  const hideSideButtons = () => {
    const { left, opacity } = anim;
    Animated.timing(opacity, {
      toValue: 0,
      duration: 15,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(left, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });
    setToggle(!toggle);
  };

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
            setIsSubmitting(true);
            deleteParcelFromDB(parcel).then(() => setIsSubmitting(false));
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
  const deleteThisParcel = () => {
    if (UserInfo.admin) {
      showConfirmDialog();
    }
    if (UserInfo.type === "Store Account" && local) {
      if (status === "Awaiting Confirmation" || status === "Awaiting Pickup")
        showConfirmDialog();
    }
  };
  const ConvertButton = () => {
    if (local && UserInfo.admin) {
      return (
        <Button onPress={() => setToggleAddParcelForm(true)}>Convert</Button>
      );
    }
    return <></>;
  };
  return (
    <>
      <Pressable
        onPress={() => (toggle ? hideSideButtons() : toggleModal())}
        onLongPress={() => {
          if (UserInfo.admin || UserInfo.type === "Store Account")
            Vibration.vibrate(200);
          showSideButtons();
        }}
      >
        <HStack>
          <Animated.View style={{ right: interpolatedLeft, width: "100%" }}>
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
          </Animated.View>
          <Animated.View style={{ right: interpolatedLeft }}>
            <VStack marginY="auto">
              <Pressable
                style={{
                  alignSelf: "center",
                  backgroundColor: "red",
                  padding: 8,
                  marginBottom: 2,
                  borderRadius: 50,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.23,
                  shadowRadius: 2.62,
                  elevation: 4,
                }}
                onPress={() => deleteThisParcel()}
              >
                <AntDesign name="delete" size={18} color="white" />
              </Pressable>
            </VStack>
          </Animated.View>
        </HStack>
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
              <ConvertButton />

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
      <Modal isOpen={isSubmitting}>
        <Modal.Content maxH="212">
          <Modal.Header>Processing...Please wait</Modal.Header>
          <Modal.Body>
            <Spinner size={"lg"} />
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <ParcelForm
        show={toggleAddParcelForm}
        parcelProp={parcel}
        toggle={setToggleAddParcelForm}
      />
    </>
  );
};
