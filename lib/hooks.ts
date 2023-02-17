import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { StoreDispatch, StoreState } from "@/store/index";

export const useStoreDispatch = () => useDispatch<StoreDispatch>();
export const useStoreSelector: TypedUseSelectorHook<StoreState> = useSelector;
