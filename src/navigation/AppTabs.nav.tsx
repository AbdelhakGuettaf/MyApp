import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "../screens/Home.screen";
import SettingsScreen from "../screens/Settings.screen";
import MyParcels from "../screens/myParcels.screen";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setUserID,
  setUserPerm,
  setParcels,
  setUserInfo,
} from "../app/user.slice";
import { getAuth } from "firebase/auth";
import { getData, getUsers } from "../app/utils";
import {
  addParcel,
  ParcelType,
  editParcelStat,
} from "../components/Parcels/ParcelsSlice";
import {
  addUnconParcel,
  resetUncon,
} from "../components/Parcels/UnconfirmedParcels.slice";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../app/firebaseConfig";
import UsersScreen from "../screens/User.screen";
import {
  addDispatcher,
  DispatcherType,
} from "../components/Dispatchers/Dispatchers.slice";
import { Header } from "../components/Header/Header";

interface AppTabsProps {}

const AppTabs: React.FC<AppTabsProps> = ({}) => {
  const dispatch = useAppDispatch();
  // const Tab = createBottomTabNavigator();
  const Tab = createMaterialTopTabNavigator();
  const auth = getAuth();
  const state = useAppSelector((state) => state);
  const { UserInfo } = state;

  useEffect(() => {
    dispatch(setUserID(auth.currentUser?.uid));
    data();
    let q = query(
      collection(db, "unConfirmedParcels"),
      where("status", "==", "Awaiting Confirmation")
    );
    if (UserInfo.type === "Store Account") {
      q = query(
        collection(db, "unConfirmedParcels"),
        where("status", "==", "Awaiting Confirmation"),
        where("storeName", "==", UserInfo.store)
      );
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      dispatch(resetUncon());
      snapshot.forEach((doc) => {
        dispatch(addUnconParcel(doc.data() as ParcelType));
      });
    });
    /* const notificationSubscription = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          schedulePushNotification({
            title: "New Parcel Added!",
            body: `Destination:  ${change.doc.data().destination}`,
            sound: true,
          });
        }
      });
    });
    if (UserInfo.admin) notificationSubscription();
*/

    return () => {
      unsubscribe();
      //notificationSubscription();
    };
  }, [UserInfo.type]);

  useEffect(() => {
    if (!UserInfo.admin) return;
    getUsers().then((res) =>
      res.map((user) => dispatch(addDispatcher(user as DispatcherType)))
    );
    const q = query(collection(db, "parcels"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          dispatch(addParcel(change.doc.data() as ParcelType));
        }
        if (change.type === "modified") {
          dispatch(editParcelStat(change.doc.data() as ParcelType));
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, [UserInfo.admin]);

  useEffect(() => {
    if (UserInfo.type !== "Store Account") return;
    getUsers().then((res) =>
      res.map((user) => dispatch(addDispatcher(user as DispatcherType)))
    );
    const q = query(
      collection(db, "parcels"),
      where("storeName", "==", UserInfo.store)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          dispatch(addParcel(change.doc.data() as ParcelType));
        }
        if (change.type === "modified") {
          dispatch(editParcelStat(change.doc.data() as ParcelType));
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, [UserInfo.store]);

  const data = async () => {
    let userPerm = false;
    const COLL_REF = collection(db, "parcels");
    const q = query(
      COLL_REF,
      where("deliveredBy", "==", auth.currentUser?.uid)
    );
    auth.currentUser?.uid
      ? getData(
          "/main/userList/users",
          auth.currentUser.uid.toString(),
          "document"
        ).then((res) => {
          if (res === undefined) throw new Error("No user document found");
          dispatch(setParcels(res.parcels));
          if (!res?.id) {
            const DOC_REF = doc(
              db,
              `/main/userList/users/${auth.currentUser?.uid}`
            );
            const set = async () => {
              await updateDoc(DOC_REF, { id: auth.currentUser?.uid });
            };
            set().catch((e) => {
              throw new Error(e);
            });
          }
          if (res?.admin) {
            userPerm = true;
            dispatch(setUserPerm());
          }
          let name = res.firstName + " " + res.lastName;
          let data = {
            type: res.accountType,
            name: name,
            phoneNumber: res.phoneNumber,
            store: "",
            storeAddress: "",
          };
          if (res.accountType === "Store Account") {
            data = { ...data, store: res.store, storeAddress: res.address };
          }
          dispatch(setUserInfo(data));
        })
      : null;
    const qLess = await getDocs(COLL_REF);
    const queued = await getDocs(q);
    if (userPerm) {
      qLess.forEach((doc) => dispatch(addParcel(doc.data() as ParcelType)));
      const q = query(
        collection(db, "unConfirmedParcels"),
        where("status", "==", "Awaiting Confirmation")
      );
      return;
    }
    queued.forEach((doc) => dispatch(addParcel(doc.data() as ParcelType)));
  };
  /* 

  
    snapshot.docChanges().forEach((change) => {
      
      if (change.type === "added") {
        let parcel = change.doc.data() as ParcelType;
        parcel.id = change.doc.id;
        dispatch(addParcel(parcel));
      }
      if (change.type === "removed") {
        let parcel = change.doc.data() as ParcelType;
        parcel.id = change.doc.id;
        dispatch(deleteParcel(parcel.id));
      }
    });



    const COLL_REF = collection(db, "parcels");
    const data = async () => {
      const f = await getDocs(COLL_REF);
      let d: ParcelType[] = [];
      f.forEach((doc) => d.push(doc.data() as ParcelType));
      return d;
    };
    data()
      .then((res) => res.map((parc) => dispatch(addParcel(parc))))
      .catch((e) => alert(e));
      
      
      if (change.type === "modified" && UserInfo.admin) {
        let parcel = change.doc.data() as ParcelType;
        parcel.id = change.doc.id;
        dispatch(editParcel(parcel));
      }
      
      */
  return (
    <>
      <NavigationContainer independent={true}>
        <Header />
        <Tab.Navigator
          transitionStyle="curl"
          tabBarPosition="bottom"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
              function getName() {
                if (route.name === "Home") {
                  return focused ? "home" : "home-outline";
                } else if (route.name === "New") {
                  return focused ? "ios-archive" : "ios-archive-outline";
                } else if (route.name === "My Parcels") {
                  return focused ? "cube" : "cube-outline";
                } else if (route.name === "Settings") {
                  return focused ? "settings" : "settings-outline";
                } else if (route.name === "Users") {
                  return focused ? "person-circle" : "person-circle-outline";
                } else if (route.name === "Users") {
                  return focused ? "person-circle" : "person-circle-outline";
                }
              }
              return <Ionicons name={getName()} size={24} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            tabBarIndicatorStyle: { backgroundColor: "tomato" },
          })}
        >
          <Tab.Screen
            name={UserInfo.admin ? "Home" : "New"}
            component={Home}
            options={
              {
                /* headerTitle: UserInfo.admin ? "Admin Acount" : UserInfo.type,
              headerLeft: () =>
                UserInfo.type === "Store Account" ? (
                  <FontAwesome5
                    style={{ marginLeft: 8 }}
                    name="store-alt"
                    size={24}
                    color="white"
                  />
                ) : (
                  <AntDesign
                    style={{ marginLeft: 8 }}
                    name="user"
                    size={24}
                    color="white"
                  />
                ),
              headerStyle: { backgroundColor: "tomato" },
              headerTintColor: "white",*/
              }
            }
          />

          <Tab.Screen
            name={UserInfo.admin ? "All Parcels" : "My Parcels"}
            component={MyParcels}
            options={{
              tabBarIcon: ({ focused }) =>
                UserInfo.admin ? (
                  <FontAwesome5
                    name="boxes"
                    size={24}
                    color={focused ? "tomato" : "gray"}
                  />
                ) : (
                  <Ionicons
                    name={"cube"}
                    size={24}
                    color={focused ? "tomato" : "gray"}
                  />
                ),
              //  headerTitle: UserInfo.admin ? "Admin Acount" : UserInfo.type,
              /* headerLeft: () =>
                UserInfo.type === "Store Account" ? (
                  <FontAwesome5
                    style={{ marginLeft: 8 }}
                    name="store-alt"
                    size={24}
                    color="white"
                  />
                ) : (
                  <AntDesign
                    style={{ marginLeft: 8 }}
                    name="user"
                    size={24}
                    color="white"
                  />
                ),
              headerStyle: { backgroundColor: "tomato" },
              headerTintColor: "white",*/
            }}
          />

          {UserInfo.admin && (
            <Tab.Screen
              name="Users"
              component={UsersScreen}
              options={
                {
                  /* headerTitle: "Users",
                headerLeft: () =>
                  UserInfo.type === "Store Account" ? (
                    <FontAwesome5
                      style={{ marginLeft: 8 }}
                      name="store-alt"
                      size={24}
                      color="white"
                    />
                  ) : (
                    <AntDesign
                      style={{ marginLeft: 8 }}
                      name="user"
                      size={24}
                      color="white"
                    />
                  ),
                headerStyle: { backgroundColor: "tomato" },
                headerTintColor: "white",*/
                }
              }
            />
          )}
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={
              {
                /*headerTitle: UserInfo.admin ? "Admin Acount" : UserInfo.type,
              headerLeft: () =>
                UserInfo.type === "Store Account" ? (
                  <FontAwesome5
                    style={{ marginLeft: 8 }}
                    name="store-alt"
                    size={24}
                    color="white"
                  />
                ) : (
                  <AntDesign
                    style={{ marginLeft: 8 }}
                    name="user"
                    size={24}
                    color="white"
                  />
                ),
              headerStyle: { backgroundColor: "tomato" },
              headerTintColor: "white",*/
              }
            }
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppTabs;
