import React from "react";
import { SettingsProps } from "./ScreenProps";
import { getAuth } from "firebase/auth";
import { Button } from "native-base";

const SettingsScreen: React.FC<SettingsProps> = ({ navigation, route }) => {
  const auth = getAuth();
  return (
    <>
      <Button onPress={() => auth.signOut()}>Sign out</Button>
    </>
  );
};
export default SettingsScreen;
