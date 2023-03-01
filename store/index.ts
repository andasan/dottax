import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import { studentSlice } from "./student-slice";

const logger = createLogger()

const store = configureStore({
  reducer: {
    students: studentSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;

export type StoreDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof store.getState>;

export const studentAction = studentSlice.actions;
export const studentState = (state: StoreState) => state.students;