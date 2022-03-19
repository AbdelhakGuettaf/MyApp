import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthStackSlice {
  firstName: string;
  lastName: string;
  email: string;
  confirmPassword: string;
  password: string;
  phoneNumber: string;
}

export const AuthStackSlice = createSlice({
  name: "authStack",
  initialState: {
    userName: "",
    location: [""],
    firstName: "",
    lastName: "",
    email: "",
    confirmPassword: "",
    password: "",
    phoneNumber: "",
  },
  reducers: {
    addName: (state, action) => {
      return { ...state, name: action.payload };
    },
    addPassword: (state, action) => {
      return { ...state, password: action.payload };
    },
  },
});

export const { addName, addPassword } = AuthStackSlice.actions;

export default AuthStackSlice.reducer;
