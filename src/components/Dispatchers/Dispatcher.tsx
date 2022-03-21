import React, { useState } from "react";
import { DispatcherType } from "./Dispatchers.slice";
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
import { callNumber } from "../../app/utils";

interface DispatcherProps {
  user: DispatcherType;
}

export const Dispatcher: React.FC<DispatcherProps> = ({
  user: { fullName, parcels, phoneNumber },
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
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

            <HStack>
              <Heading fontSize="md" isTruncated>
                {fullName}
              </Heading>
            </HStack>
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
          </HStack>
        </View>
      </Pressable>
      <Modal isOpen={modalVisible} onClose={toggleModal} size="xl">
        <Modal.Content maxH="360">
          <Modal.CloseButton />
          <Modal.Header>
            <Divider my="1" />
          </Modal.Header>
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
