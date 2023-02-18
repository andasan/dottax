"use client";

import React from 'react'
import { Provider } from "react-redux";
import store from "@/store/index";

export default function ReduxRegistry({ children } : { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
