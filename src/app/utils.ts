import { Alert, Linking, Platform } from "react-native";
import { db } from "./firebaseConfig";
import {
  doc,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
  addDoc,
  getDoc,
  deleteDoc,
  arrayUnion,
  DocumentData,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { store } from "../store/store";
import { ParcelType } from "../components/Parcels/ParcelsSlice";

export const callNumber = (phone: string) => {
  let phoneNumber: string;
  if (Platform.OS !== "android") {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        Alert.alert("Phone number is not available");
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const getDataStatic = async () => {
  const parcels: ParcelType[] = [];
  const auth = getAuth();
  const COLL_REF = collection(db, "parcels");
  const COLL_REF_UN = collection(db, "unConfirmedParcels");
  const q = query(COLL_REF, where("deliveredBy", "==", auth.currentUser?.uid));
  const queued = await getDocs(q).catch((e) => {
    throw new Error(e);
  });
  const queuedUn = await getDocs(COLL_REF_UN).catch((e) => {
    throw new Error(e);
  });
  queued.forEach((doc) => parcels.push(doc.data() as ParcelType));
  queuedUn.forEach((doc) => parcels.push(doc.data() as ParcelType));
  return parcels;
};

export const getData = async (location: string, name: string, type: string) => {
  const state = store.getState().UserInfo;
  const { uid } = state;
  if (type === "document") {
    const DOC_REF = doc(collection(db, location), name);
    const data = await getDoc(DOC_REF);
    return data.data();
  }
  if (type === "collection") {
    const COLL_REF = collection(db, location, name);
    const data = await getDocs(COLL_REF);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    data.forEach((doc) => {
      result.push(doc);
    });
    return result;
  }
};

export const addParcelToDB = async (parcel: ParcelType) => {
  parcel = {
    ...parcel,
    icon: "exclamation",
    color: "#0ea5e9",
    createdAt: new Date().toLocaleDateString("ar-ar", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    id: "",
    status: "Awaiting Confirmation",
  };
  let id = "";
  const COLL_REF = collection(db, "unConfirmedParcels");
  const SET_DOC = await addDoc(COLL_REF, parcel)
    .then((res) => {
      return (id = res.id);
    })
    .catch((e) => {
      throw new Error(e.message + " in Utils");
    });
  await updateDoc(doc(COLL_REF, id), { id: id });
  return SET_DOC;
};

export const confirmParcel = async (parcel: ParcelType) => {
  const state = store.getState();
  const { UserInfo } = state;
  const DOC_REF = doc(db, "main", "userList", "users", UserInfo.uid);
  const PARCEL_REF = doc(collection(db, "parcels"), parcel.id);
  await updateDoc(DOC_REF, {
    parcels: arrayUnion(parcel.id),
  });
  await updateDoc(PARCEL_REF, {
    deliveredBy: UserInfo.uid,
  });
};

export const getUsers = async () => {
  const COLL_REF = collection(db, "main", "userList", "users");
  const data: DocumentData[] = [];
  await getDocs(COLL_REF).then((snapshot) => {
    snapshot.forEach((doc) => data.push(doc.data() as DocumentData));
  });
  return data;
};

export async function deleteParcelFromDB(parcel: ParcelType) {
  if (parcel.status === "Awaiting Confirmation") {
    await deleteDoc(doc(db, "unConfirmedParcels", parcel.id)).catch((e) => {
      alert(e);
    });
    return;
  }
  await deleteDoc(doc(db, "parcels", parcel.id)).catch((e) => {
    alert(e);
  });
}
