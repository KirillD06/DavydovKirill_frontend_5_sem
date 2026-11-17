import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../api/users";

const initialState: { user: User | null } = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    signedOut(state) {
      state.user = null;
    },
  },
});

export const { signedIn, signedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
