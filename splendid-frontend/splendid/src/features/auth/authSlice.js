import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        RegisterSuccess: (state)=>{

        }
    }
});


export const { RegisterSuccess } = authSlice.actions;
export default authSlice.reducer;