import { configureStore } from "@reduxjs/toolkit";

import { modalSlice } from "./modal-slice";
import { studentSlice } from "./student-slice";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    students: studentSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;

export type StoreDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof store.getState>;

export const modalAction = modalSlice.actions;
export const toggleState = (state: StoreState) => state.modal;

export const studentAction = studentSlice.actions;
export const studentState = (state: StoreState) => state.students;
