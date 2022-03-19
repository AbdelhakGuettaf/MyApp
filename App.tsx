import React, { useEffect, useState } from "react";
import "./src/app/firebaseConfig";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import "react-native-gesture-handler";
import { extendTheme, NativeBaseProvider } from "native-base";
import AppTabs from "./src/navigation/AppTabs.nav";
import { AuthScreen } from "./src/navigation/Auth.nav";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, LogBox, View } from "react-native";

LogBox.ignoreLogs([
  "Setting a timer for a long",
  "AsyncStorage has been extracted ",
]);

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setLoading(false);

        // ...
      } else {
        // User is signed out
        setLoading(false);
        setLoggedIn(false);
      }
    });
  }, []);

  if (loading)
    return (
      <View
        style={{
          alignContent: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size={100} color="#03bafc" />
      </View>
    );
  const theme = extendTheme({
    config: {
      // Changing initialColorMode to 'dark'
      initialColorMode: "light",
    },
  });
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        {loggedIn ? <AppTabs /> : <AuthScreen />}
      </NativeBaseProvider>
    </Provider>
  );
}
