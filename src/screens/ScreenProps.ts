import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type AppTabsProps = {
  Home: undefined;
  Settings: undefined;
  Users: undefined;
  MyParcels: undefined;
};

export type HomeProps = BottomTabScreenProps<AppTabsProps, "Home">;
export type SettingsProps = BottomTabScreenProps<AppTabsProps, "Settings">;
export type UsersProps = BottomTabScreenProps<AppTabsProps, "Users">;
export type MyParcelsProps = BottomTabScreenProps<AppTabsProps, "MyParcels">;
