import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authReducer } from "./authSlice";
import { soilFilterReducer } from "./soilFilterSlice";
import { soilTypesReducer } from "./soilTypesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    soilTypesFilter: soilFilterReducer,
    soilTypes: soilTypesReducer,
  },
});

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>();
