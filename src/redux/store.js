
import { persistReducer } from "redux-persist";
import loginReducer from "./slices/loginSlice";
import dataReducer from "./slices/UserResultSlice";

import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
export const rootReducer = combineReducers({
  loginReducer,
  dataReducer

});

const persistedReducers = persistReducer(persistConfig, rootReducer);

export default persistedReducers;
