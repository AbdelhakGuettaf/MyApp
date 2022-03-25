import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home.screen";
import SettingsScreen from "../screens/Settings.screen";
import MyParcels from "../screens/myParcels.screen";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setUserID, setUserPerm, setParcels } from "../app/user.slice";
import { getAuth } from "firebase/auth";
import { getData } from "../app/utils";
import {
  addParcel,
  ParcelType,
  editParcelStat,
} from "../components/Parcels/ParcelsSlice";
import {
  addUnconParcel,
  reset,
} from "../components/Parcels/UnconfirmedParcels.slice";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../app/firebaseConfig";
import UsersScreen from "../screens/User.screen";

interface AppTabsProps {}

const AppTabs: React.FC<AppTabsProps> = ({}) => {
  const dispatch = useAppDispatch();
  const Tab = createBottomTabNavigator();
  const auth = getAuth();
  const state = useAppSelector((state) => state);
  const { UserInfo } = state;

  useEffect(() => {
    const q = query(
      collection(db, "unConfirmedParcels"),
      where("status", "==", "Awaiting Confirmation")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      dispatch(reset());
      snapshot.forEach((doc) => {
        dispatch(addUnconParcel(doc.data() as ParcelType));
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    dispatch(setUserID(auth.currentUser?.uid));
    data();
  }, []);

  useEffect(() => {
    if (!UserInfo.admin) return;
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
          dispatch(setParcels(res?.parcels));
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
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "New") {
                iconName = focused ? "ios-archive" : "ios-archive-outline";
              } else if (route.name === "My Parcels") {
                iconName = focused ? "cube" : "cube-outline";
              } else if (route.name === "Settings") {
                iconName = focused ? "settings" : "settings-outline";
              } else if (route.name === "Users") {
                iconName = focused ? "person-circle" : "person-circle-outline";
              } else if (route.name === "Users") {
                iconName = focused ? "person-circle" : "person-circle-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name={UserInfo.admin ? "Home" : "New"}
            component={Home}
            options={{
              headerTitle: UserInfo.admin ? "Admin Acount" : "Delivery Account",
              headerLeft: () => (
                <AntDesign
                  style={{ marginLeft: 8 }}
                  name="user"
                  size={24}
                  color="white"
                />
              ),
              headerStyle: { backgroundColor: "tomato" },
              headerTintColor: "white",
            }}
          />

          {UserInfo.admin ? (
            <Tab.Screen
              name="All Parcels"
              component={MyParcels}
              options={{
                tabBarIcon: ({ focused }) => (
                  <FontAwesome5
                    name="boxes"
                    size={24}
                    color={focused ? "tomato" : "gray"}
                  />
                ),
                headerTitle: "Admin Acount",
                headerLeft: () => (
                  <AntDesign
                    style={{ marginLeft: 8 }}
                    name="user"
                    size={24}
                    color="white"
                  />
                ),
                headerStyle: { backgroundColor: "tomato" },
                headerTintColor: "white",
              }}
            />
          ) : (
            <Tab.Screen
              name="My Parcels"
              component={MyParcels}
              options={{
                headerTitle: "Delivery Account",
                headerLeft: () => (
                  <AntDesign
                    style={{ marginLeft: 8 }}
                    name="user"
                    size={24}
                    color="white"
                  />
                ),
                headerStyle: { backgroundColor: "tomato" },
                headerTintColor: "white",
              }}
            />
          )}

          {UserInfo.admin ? (
            <Tab.Screen
              name="Users"
              component={UsersScreen}
              options={{
                headerTitle: "Users",
                headerLeft: () => (
                  <AntDesign
                    style={{ marginLeft: 8 }}
                    name="user"
                    size={24}
                    color="white"
                  />
                ),
                headerStyle: { backgroundColor: "tomato" },
                headerTintColor: "white",
              }}
            />
          ) : null}
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerTitle: UserInfo.admin ? "Admin Acount" : "Delivery Account",
              headerLeft: () => (
                <AntDesign
                  style={{ marginLeft: 8 }}
                  name="user"
                  size={24}
                  color="white"
                />
              ),
              headerStyle: { backgroundColor: "tomato" },
              headerTintColor: "white",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default AppTabs;
