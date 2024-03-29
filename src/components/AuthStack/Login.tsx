import React, { useState } from "react";
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
} from "native-base";
import { LoginProps } from "./AuthStackParamList";
import { SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
type error = {
  password?: string;
  name?: string;
};

const AuthStack: React.FC<LoginProps> = ({ navigation, route }) => {
  const [password, setPassWord] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [tempUser, setTempUser] = useState<User>();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [error, setError] = useState<error>({});
  const auth = getAuth();

  const login = async () => {
    await signInWithEmailAndPassword(auth, loginEmail, password).catch(
      (error) => alert(error.message)
    );
  };
  return (
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
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Welcome!
        </Heading>
        <Heading
          alignSelf="center"
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5" w="100%">
          <FormControl isRequired isInvalid={"name" in error}>
            <FormControl.Label>User Name</FormControl.Label>
            <Input
              placeholder="My User Name"
              InputRightElement={
                <Icon
                  as={<MaterialIcons name="email" />}
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              }
              onChangeText={(text) => setLoginEmail(text.trim())}
            />
            {error.name ? (
              <FormControl.ErrorMessage>{error.name}</FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isRequired isInvalid={"password" in error}>
            <FormControl.Label>Password</FormControl.Label>
            <Box alignItems="center">
              <Input
                type={show ? "text" : "password"}
                w="100%"
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
                onChangeText={(text) => setPassWord(text)}
                placeholder="Password"
              />
            </Box>

            <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "primary.500",
              }}
              alignSelf="flex-end"
              mt="1"
            >
              Forget Password?
            </Link>
            {error.password ? (
              <FormControl.ErrorMessage>
                {error.password}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <Button mt="2" colorScheme="primary" onPress={() => login()}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              I'm a new user.
            </Text>
            <Link
              _text={{
                color: "primary.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => navigation.navigate("Register")}
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};
export default AuthStack;
