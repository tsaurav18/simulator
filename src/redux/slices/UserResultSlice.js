import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user_result_data: {},
  
};

export const dataSlice = createSlice({
  name: "userResult",
  initialState,
  reducers: {
    saveDataState: (state, action) => {
      // console.log("in to login Info ", state, action);
      state.user_result_data = action.payload;
     
    },
    resetDataState: (state) => {
      return initialState; // Reset the state to the initial state
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveDataState, resetDataState } = dataSlice.actions;

export default dataSlice.reducer;
