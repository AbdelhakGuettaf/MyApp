import { StackScreenProps } from "@react-navigation/stack";

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type LoginProps = StackScreenProps<AuthStackParamList, "Login">;
export type RegisterProps = StackScreenProps<AuthStackParamList, "Register">;
