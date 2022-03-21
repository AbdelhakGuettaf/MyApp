import React, { useState } from "react";
import { RegisterProps } from "./AuthStackParamList";
import {
  Center,
  NativeBaseProvider,
  Input,
  HStack,
  VStack,
  NumberInputField,
  Divider,
  FormControl,
  Box,
  Link,
  Text,
  Button,
  Heading,
  Icon,
  View,
  ScrollView,
  Spinner,
  Modal,
} from "native-base";
import { LoginProps } from "./AuthStackParamList";
import { SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  User,
  updateProfile,
} from "firebase/auth";
import { store } from "../../store/store";
import { communes } from "../../app/locationData.json";
import MultiSelect from "react-native-multiple-select";
import { db } from "../../app/firebaseConfig";
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  setDoc,
  getDoc,
} from "@firebase/firestore";
import { useForm } from "react-hook-form";

type error = {
  phoneNumber?: string;
  password?: string;
  confirmPass?: string;
  nameError?: string;
  location?: string;
};
type formState = {
  firstName: string;
  userName: string;
  lastName: string;
  email: string;
  confirmPassword: string;
  password: string;
  phoneNumber: string;
  location: [""];
};

const Register: React.FC<RegisterProps> = ({ navigation, route }) => {
  const [formStateData, setFormstate] = useState<formState>({
    userName: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
    location: [""],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<error>({});
  const handleClick = () => setShow(!show);
  const auth = getAuth();

  const {
    confirmPassword,
    userName,
    email,
    firstName,
    lastName,
    location,
    password,
    phoneNumber,
  } = formStateData;

  const register = async () => {
    if (confirmPassword !== password) return alert("Passwords do not match");
    setIsSubmitting(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        const user = res.user;
        updateProfile(user, { displayName: userName, photoURL: "" }).catch(
          (e) => {
            setIsSubmitting(false);
            alert(e.message);
          }
        );
        const docRef = doc(
          collection(db, "main", "users", user.uid),
          "userData"
        );
        const parcelsDocRef = doc(
          collection(db, "main", "users", user.uid),
          "myParcels"
        );
        await setDoc(parcelsDocRef, { parcels: [] });
        await setDoc(docRef, {
          phoneNumber,
          firstName,
          lastName,
          location,
          admin: false,
        }).catch((e) => {
          setIsSubmitting(false);
          alert(e.message);
        });
      })
      .catch((error) => {
        setIsSubmitting(false);
        alert(error.message);
      });
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <NativeBaseProvider>
            <Center w="100%">
              <Box
                p="5"
                safeArea
                w="100%"
                maxW="600px"
                style={{ backgroundColor: "white", borderRadius: 8 }}
              >
                <Heading
                  alignSelf="center"
                  size="lg"
                  color="coolGray.800"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  fontWeight="semibold"
                >
                  Welcome!
                </Heading>
                <Heading
                  alignSelf="center"
                  mt="1"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontWeight="medium"
                  size="xs"
                >
                  Sign up to continue!
                </Heading>
                <VStack space={3} mt="5">
                  <FormControl isRequired isInvalid={"nameError" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Full Name
                    </FormControl.Label>
                    <HStack width={"full"}>
                      <Input
                        w="1/2"
                        placeholder="Jhon"
                        onChangeText={(text) =>
                          setFormstate({ ...formStateData, firstName: text })
                        }
                      />
                      <Input
                        w="1/2"
                        marginLeft={3}
                        placeholder="Smith"
                        onChangeText={(text) =>
                          setFormstate({ ...formStateData, lastName: text })
                        }
                      />
                    </HStack>
                    {errors.nameError ? (
                      <FormControl.ErrorMessage>
                        {errors.nameError}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"nameError" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Email
                    </FormControl.Label>
                    <Input
                      placeholder="Email@email.com"
                      onChangeText={(text) =>
                        setFormstate({ ...formStateData, email: text })
                      }
                    />
                    {errors.nameError ? (
                      <FormControl.ErrorMessage>
                        {errors.nameError}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"phoneNumber" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Phone Number
                    </FormControl.Label>
                    <Input
                      keyboardType="phone-pad"
                      placeholder="01 23 45 67 89"
                      onChangeText={(text) =>
                        setFormstate({ ...formStateData, phoneNumber: text })
                      }
                    />
                    {errors.phoneNumber ? (
                      <FormControl.ErrorMessage>
                        {errors.phoneNumber}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"password" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Password
                    </FormControl.Label>
                    <Input
                      type={show ? "text" : "password"}
                      onChangeText={(text) =>
                        setFormstate({ ...formStateData, password: text })
                      }
                      placeholder="Password should contain 8 charachter"
                      InputRightElement={
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          mr="2"
                          color={show ? "primary.500" : "muted.400"}
                          onPress={handleClick}
                        />
                      }
                    />
                    {errors.password ? (
                      <FormControl.ErrorMessage>
                        {errors.password}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"confirmPass" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Confirm Password
                    </FormControl.Label>
                    <Input
                      type={show ? "text" : "password"}
                      placeholder="Confirm password"
                      onChangeText={(text) =>
                        setFormstate({
                          ...formStateData,
                          confirmPassword: text,
                        })
                      }
                      InputRightElement={
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          mr="2"
                          color={show ? "primary.500" : "muted.400"}
                          onPress={handleClick}
                        />
                      }
                    />
                    {errors.confirmPass ? (
                      <FormControl.ErrorMessage>
                        {errors.confirmPass}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <Button
                    mt="2"
                    colorScheme="primary"
                    onPress={() => register()}
                  >
                    Sign up
                  </Button>
                </VStack>
              </Box>
            </Center>
          </NativeBaseProvider>
          <Modal isOpen={isSubmitting}>
            <Modal.Content maxH="212">
              <Modal.CloseButton />
              <Modal.Header>Getting things ready...</Modal.Header>
              <Modal.Body>
                <Spinner size={"lg"} />
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Register;

{
  /*


      <SafeAreaView>
        <View>
          <NativeBaseProvider>
            <Center w="100%">
              <Box
                p="5"
                safeArea
                w="100%"
                maxW="600px"
                style={{ backgroundColor: "white", borderRadius: 8 }}
              >
                <Heading
                  alignSelf="center"
                  size="lg"
                  color="coolGray.800"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  fontWeight="semibold"
                >
                  Welcome!
                </Heading>
                <Heading
                  alignSelf="center"
                  mt="1"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontWeight="medium"
                  size="xs"
                >
                  Sign up to continue!
                </Heading>
                <VStack space={3} mt="5">
                  <FormControl isRequired isInvalid={"nameError" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Full Name
                    </FormControl.Label>
                    <HStack width={"full"}>
                      <Input
                        w="1/2"
                        placeholder="Jhon"
                        onChangeText={(text) =>
                          setFormstate({ ...formStateData, firstName: text })
                        }
                      />
                      <Input
                        w="1/2"
                        marginLeft={3}
                        placeholder="Smith"
                        onChangeText={(text) =>
                          setFormstate({ ...formStateData, lastName: text })
                        }
                      />
                    </HStack>
                    {errors.nameError ? (
                      <FormControl.ErrorMessage>
                        {errors.nameError}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"nameError" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Email
                    </FormControl.Label>
                    <Input
                      placeholder="Email@email.com"
                      onChangeText={(text) =>
                        setFormstate({ ...formStateData, email: text })
                      }
                    />
                    {errors.nameError ? (
                      <FormControl.ErrorMessage>
                        {errors.nameError}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"phoneNumber" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Phone Number
                    </FormControl.Label>
                    <Input
                      keyboardType="phone-pad"
                      placeholder="01 23 45 67 89"
                      onChangeText={(text) =>
                        setFormstate({ ...formStateData, phoneNumber: text })
                      }
                    />
                    {errors.phoneNumber ? (
                      <FormControl.ErrorMessage>
                        {errors.phoneNumber}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"password" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Password
                    </FormControl.Label>
                    <Input
                      type={show ? "text" : "password"}
                      onChangeText={(text) =>
                        setFormstate({ ...formStateData, password: text })
                      }
                      placeholder="Password should contain 8 charachter"
                      InputRightElement={
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          mr="2"
                          color={show ? "primary.500" : "muted.400"}
                          onPress={handleClick}
                        />
                      }
                    />
                    {errors.password ? (
                      <FormControl.ErrorMessage>
                        {errors.password}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={"confirmPass" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Confirm Password
                    </FormControl.Label>
                    <Input
                      type={show ? "text" : "password"}
                      placeholder="Confirm password"
                      onChangeText={(text) =>
                        setFormstate({
                          ...formStateData,
                          confirmPassword: text,
                        })
                      }
                      InputRightElement={
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          mr="2"
                          color={show ? "primary.500" : "muted.400"}
                          onPress={handleClick}
                        />
                      }
                    />
                    {errors.confirmPass ? (
                      <FormControl.ErrorMessage>
                        {errors.confirmPass}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <Button
                    mt="2"
                    colorScheme="primary"
                    onPress={() => register()}
                  >
                    Sign up
                  </Button>
                </VStack>
              </Box>
            </Center>
          </NativeBaseProvider>
          <Modal isOpen={isSubmitting}>
            <Modal.Content maxH="212">
              <Modal.CloseButton />
              <Modal.Header>Getting things ready...</Modal.Header>
              <Modal.Body>
                <Spinner size={"lg"} />
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </View>
      </SafeAreaView>

*/
}
