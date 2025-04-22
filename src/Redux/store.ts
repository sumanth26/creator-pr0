import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import signinReducer from "./signinSlice";
import logoutReducer from "./logoutslice"
import userReducer from "./userSlice"
import profileImageReducer from "./profileImageSlice"
import socialLinksReducer from "./socialLinksSlice"
import offeringsReducer from "./offeringsSlice"
import subsctiptionReducer from "./subscriptionsSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    signin: signinReducer,
    logout:logoutReducer,
    user:userReducer,
    profileImage:profileImageReducer,
    socialLinks:socialLinksReducer,
    offerings:offeringsReducer,
    subscription:subsctiptionReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
