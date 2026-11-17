import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { signedOut } from "./authSlice";

const initialState = { value: 2, maxLoosening: 2 };

const soilFilterSlice = createSlice({
  name: "soilTypesFilter",
  initialState,
  reducers: {
    setFilterValue(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
    applySoilFilter(state) {
      state.maxLoosening = state.value;
    },
    resetSoilFilter: () => initialState,
  },
  extraReducers(builder) {
    builder.addCase(signedOut, () => initialState);
  },
});

export const { setFilterValue, applySoilFilter, resetSoilFilter } =
  soilFilterSlice.actions;
export const soilFilterReducer = soilFilterSlice.reducer;
