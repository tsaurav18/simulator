import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user_id: "",
  is_staff: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginInfo: (state, action) => {
      // console.log("in to login Info ", state, action);
      state.user_id = action.payload.user_id;
    
      state.is_staff = action.payload.is_staff;
     
    },
    resetState: (state) => {
      return initialState; // Reset the state to the initial state
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginInfo, resetState } = loginSlice.actions;

export default loginSlice.reducer;
