import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import Login from "../components/AuthStack/Login";
import Register from "../components/AuthStack/Register";
interface AuthScreen {}

export const AuthScreen: React.FC<AuthScreen> = ({}) => {
  const Stack = createStackNavigator();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerTitleAlign: "center" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
