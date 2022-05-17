import React, { useState } from "react";
import {
  Center,
  NativeBaseProvider,
  Input,
  HStack,
  VStack,
  FormControl,
  Box,
  Button,
  Heading,
  Icon,
  View,
  ScrollView,
  Spinner,
  Modal,
  Select,
} from "native-base";
import { SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../../app/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";

type error = {
  store?: string;
  emailError?: string;
  phoneNumber?: string;
  password?: string;
  confirmPass?: string;
  nameError?: string;
  location?: string;
};
type formState = {
  accountType: string;
  storeName: string;
  storeAddress: string;
  firstName: string;
  userName: string;
  lastName: string;
  email: string;
  confirmPassword: string;
  password: string;
  phoneNumber: string;
  location: [];
};

interface Props {
  goBack?: () => void;
}

const Register: React.FC<Props> = ({ goBack }) => {
  const [formStateData, setFormstate] = useState<formState>({
    accountType: "dispatcher",
    storeAddress: "",
    storeName: "",
    userName: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phoneNumber: "",
    location: [],
  });
  const errorsInit: error = {};
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<error>(errorsInit);
  const handleClick = () => setShow(!show);
  const auth = getAuth();

  const {
    storeAddress,
    storeName,
    accountType,
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
    setErrors(errorsInit);
    console.log(errors);
    if (firstName === "" || lastName === "")
      return setErrors({ nameError: "Please input your name" });
    if (email === "")
      return setErrors({ emailError: "Please input your Email" });
    if (phoneNumber === "")
      return setErrors({
        phoneNumber: "Please input your phone number",
      });
    if (password === "")
      return setErrors({ password: "Please choose a password" });
    if (confirmPassword !== password)
      return setErrors({ confirmPass: "Passwords do not match" });
    if (
      accountType === "Store Account" &&
      storeAddress === "" &&
      storeName === ""
    )
      return setErrors({
        store: "Please fill both the name and address of the store",
      });
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
        const docRef = doc(db, "main", "userList", "users", user.uid);
        await setDoc(docRef, {
          phoneNumber,
          firstName,
          lastName,
          location,
          parcels: [],
          admin: false,
          accountType: accountType,
          address: storeAddress,
          store: storeName,
        })
          .then(() => {
            if (accountType === "Store Account") {
              setIsSubmitting(false);
              goBack;
            }
          })
          .catch((e) => {
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
                    {errors.nameError && (
                      <FormControl.ErrorMessage>
                        {errors.nameError}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isRequired isInvalid={"emailError" in errors}>
                    <FormControl.Label _text={{ bold: true }}>
                      Email
                    </FormControl.Label>
                    <Input
                      placeholder="Email@email.com"
                      onChangeText={(text) =>
                        setFormstate({ ...formStateData, email: text.trim() })
                      }
                    />
                    {errors.nameError && (
                      <FormControl.ErrorMessage>
                        {errors.nameError}
                      </FormControl.ErrorMessage>
                    )}
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
                    {errors.phoneNumber && (
                      <FormControl.ErrorMessage>
                        {errors.phoneNumber}
                      </FormControl.ErrorMessage>
                    )}
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
                          color={show ? "tomato" : "muted.400"}
                          onPress={handleClick}
                        />
                      }
                    />
                    {errors.password && (
                      <FormControl.ErrorMessage>
                        {errors.password}
                      </FormControl.ErrorMessage>
                    )}
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
                          color={show ? "tomato" : "muted.400"}
                          onPress={handleClick}
                        />
                      }
                    />
                    {errors.confirmPass && (
                      <FormControl.ErrorMessage>
                        {errors.confirmPass}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                  <FormControl p="1" borderRadius={"lg"} bg={"gray.100"}>
                    <FormControl.Label>Account Type</FormControl.Label>
                    <Select
                      selectedValue={accountType}
                      onValueChange={(itemValue) =>
                        setFormstate({
                          ...formStateData,
                          accountType: itemValue,
                        })
                      }
                    >
                      <Select.Item
                        label="Dispatcher"
                        value="Dispatcher Account"
                      />
                      <Select.Item label="Store" value="Store Account" />
                    </Select>
                  </FormControl>
                  {accountType === "Store Account" && (
                    <FormControl isRequired isInvalid={"store" in errors}>
                      <FormControl.Label>Store Name</FormControl.Label>
                      <Input
                        placeholder="My Store"
                        onChangeText={(text) =>
                          setFormstate({ ...formStateData, storeName: text })
                        }
                      />
                      <FormControl.Label>Store Address</FormControl.Label>
                      <Input
                        placeholder="My Address"
                        onChangeText={(text) =>
                          setFormstate({ ...formStateData, storeAddress: text })
                        }
                      />
                      {errors.store && (
                        <FormControl.ErrorMessage>
                          {errors.store}
                        </FormControl.ErrorMessage>
                      )}
                    </FormControl>
                  )}
                  <Button mt="2" bgColor="tomato" onPress={() => register()}>
                    Sign up
                  </Button>
                </VStack>
              </Box>
            </Center>
          </NativeBaseProvider>
          <Modal isOpen={isSubmitting}>
            <Modal.Content maxH="212">
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

      <Center>
        <Text>Registration is not available in this version...</Text>
      </Center>

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
