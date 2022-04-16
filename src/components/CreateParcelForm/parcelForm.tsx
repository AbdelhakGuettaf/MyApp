import { Parcels } from "../../components/Parcels/Parcels";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import React, { Dispatch, useEffect, useState } from "react";
import { addParcelToDB, deleteParcelFromDB } from "../../app/utils";
import { communes } from "../../app/locationData.json";
import { AntDesign } from "@expo/vector-icons";
import { ParcelType } from "../../components/Parcels/ParcelsSlice";

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
  Spinner,
  Text,
  TextArea,
  WarningOutlineIcon,
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import { Alert, Pressable } from "react-native";

interface parcelFormProps {
  parcelProp?: ParcelType;
  show: boolean;
  toggle: Dispatch<React.SetStateAction<boolean>>;
}

export const ParcelForm: React.FC<parcelFormProps> = ({
  parcelProp,
  show,
  toggle,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
  const convertParcel = (parcel: ParcelType) => {
    let newParcel = {
      ...parcel,
      description: parcel.description + "\nFrom store: " + parcel.storeName,
      local: false,
    };
    return newParcel;
  };
  const [newParcel, setNewParcel] = useState<ParcelType>(
    parcelProp?.local ? convertParcel(parcelProp) : initialNewParcelState
  );

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
    setIsSubmitting(true);
    addParcelToDB(newParcel)
      .then(() => {
        if (parcelProp) deleteParcelFromDB(parcelProp).catch((e) => alert(e));
      })
      .then(() => setIsSubmitting(false))
      .finally(() => toggle(false))
      .catch((e) => {
        alert(e);
      });
  };
  return (
    <Modal isOpen={show} onClose={toggle} size="xl">
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
                toggle(false);
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
      <Modal isOpen={isSubmitting}>
        <Modal.Content maxH="212">
          <Modal.Header>Processing...Please wait</Modal.Header>
          <Modal.Body>
            <Spinner size={"lg"} />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Modal>
  );
};
