import { Parcels } from "../components/Parcels/Parcels";
import { HomeProps } from "./ScreenProps";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import React, { useEffect, useState } from "react";
import { addParcelToDB } from "../app/utils";
import { communes } from "../app/locationData.json";
import { AntDesign } from "@expo/vector-icons";
import { ParcelType } from "../components/Parcels/ParcelsSlice";

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
import { Alert, Pressable } from "react-native";

const Home: React.FC<HomeProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const STATE = useAppSelector((state) => state);
  const { UserInfo } = STATE;
  const TYPE = UserInfo.type === "Store Account" ? true : false;
  const initialNewParcelState: ParcelType = {
    id: "",
    deliveredBy: "",
    parcelName: "",
    description: "",
    destination: "",
    paymentValue: "",
    createdAt: new Date().toLocaleDateString("ar-ar", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    phoneNumber: "",
    status: "Awaiting Confirmation",
    tracking: "",
    icon: "exclamation",
    color: "",
  };
  const [newParcel, setNewParcel] = useState<ParcelType>(initialNewParcelState);
  const [toggleForm, setToggleForm] = useState<boolean>(false);

  const submitParcel = () => {
    if (
      !newParcel.parcelName ||
      !newParcel.tracking ||
      !newParcel.phoneNumber ||
      !newParcel.destination ||
      !newParcel.paymentValue
    ) {
      return Alert.alert(
        "Error",
        "Please make sure to fill all required fields",
        [
          {
            text: "Ok",
          },
        ]
      );
    }
    setToggleForm(false);
    addParcelToDB(newParcel)
      .then((res) => setNewParcel(initialNewParcelState))
      .catch((e) => {
        throw new Error(e);
      });
  };

  const toggleModal = () => {
    if (TYPE) {
      setNewParcel({
        ...newParcel,
        tracking: "0",
        local: true,
        storeAddress: UserInfo.storeAddress,
        storeName: UserInfo.store,
        storePhoneNumber: UserInfo.phoneNumber,
      });
    }
    setToggleForm(!toggleForm);
  };

  const RenderButton = () => {
    if (UserInfo.admin || TYPE) {
      return (
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
          onPress={() => toggleModal()}
        >
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      );
    }
    return <></>;
  };
  return (
    <>
      <Parcels status="Awaiting Confirmation" />
      <RenderButton />
      <Center>
        <Modal isOpen={toggleForm} onClose={toggleModal} size="xl">
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>
              <Heading>Create new {TYPE ? "store" : null} parcel</Heading>
            </Modal.Header>
            <Modal.Body>
              <ScrollView>
                <FormControl>
                  <HStack>
                    <FormControl.Label alignItems={"center"} w="1/4" isRequired>
                      <Text>Name</Text>
                    </FormControl.Label>
                    <Input
                      flexGrow={"1"}
                      onChangeText={(text) =>
                        setNewParcel({ ...newParcel, parcelName: text })
                      }
                      placeholder="Name of Recepient"
                      value={newParcel.parcelName}
                    />
                  </HStack>
                </FormControl>
                <FormControl mt="3">
                  <HStack>
                    <FormControl w="full" isRequired>
                      <Select
                        accessibilityLabel="Choose Destination"
                        placeholder="Desitination"
                        selectedValue={newParcel.destination}
                        onValueChange={(text) =>
                          setNewParcel({ ...newParcel, destination: text })
                        }
                        dropdownIcon={
                          <AntDesign
                            name="caretdown"
                            style={{ marginRight: 3 }}
                            size={15}
                            color="black"
                          />
                        }
                      >
                        {communes.map((city, key) => (
                          <Select.Item key={key} label={city} value={city} />
                        ))}
                      </Select>
                    </FormControl>
                  </HStack>
                </FormControl>
                <FormControl mt="3" isRequired>
                  <HStack>
                    <FormControl.Label alignItems={"center"} w="1/4">
                      <Text>Amount</Text>
                    </FormControl.Label>
                    <Input
                      value={newParcel.paymentValue}
                      onChangeText={(text) =>
                        setNewParcel({ ...newParcel, paymentValue: text })
                      }
                      keyboardType="number-pad"
                      flexGrow={"1"}
                      placeholder="Payment Amount"
                    />
                    <InputRightAddon bg="gray.200" children={"DA"} />
                  </HStack>
                </FormControl>
                {!TYPE && (
                  <FormControl mt="3" isRequired>
                    <HStack>
                      <FormControl.Label alignItems={"center"} w="1/4">
                        <Text>Tracking n°</Text>
                      </FormControl.Label>
                      <Input
                        value={newParcel.tracking}
                        onChangeText={(text) =>
                          setNewParcel({ ...newParcel, tracking: text })
                        }
                        keyboardType="number-pad"
                        flexGrow={"1"}
                        placeholder="Tracking number"
                      />
                    </HStack>
                  </FormControl>
                )}
                <FormControl mt="3" isRequired>
                  <HStack>
                    <FormControl.Label alignItems={"center"} w="1/4">
                      <Text>Phone n°</Text>
                    </FormControl.Label>
                    <Input
                      value={newParcel.phoneNumber}
                      onChangeText={(text) =>
                        setNewParcel({ ...newParcel, phoneNumber: text })
                      }
                      keyboardType="number-pad"
                      flexGrow={"1"}
                      placeholder="Phone Number"
                    />
                  </HStack>
                </FormControl>
                <FormControl mt="3">
                  <HStack>
                    <FormControl.Label alignItems={"center"} w="1/4">
                      <Text>Description</Text>
                    </FormControl.Label>
                    <TextArea
                      value={newParcel.description}
                      onChangeText={(text) =>
                        setNewParcel({ ...newParcel, description: text })
                      }
                      h={20}
                      flexGrow={"1"}
                      keyboardType="default"
                      placeholder="description"
                    />
                  </HStack>
                </FormControl>
              </ScrollView>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setToggleForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onPress={() => submitParcel()} bgColor={"tomato"}>
                  Submit
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};

export default Home;
