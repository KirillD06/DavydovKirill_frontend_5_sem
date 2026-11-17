import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { SoilType } from "../types/soil-type";
import type { SoilResult } from "./soilTypesThunks";
import {
  createSoilDraft, deleteSoilType, likeSoilType, loadSoilDraft,
  loadSoilType, loadSoilTypes, publishSoilType,
} from "./soilTypesThunks";
import { signedIn, signedOut } from "./authSlice";

interface Resource<T> {
  value: T;
  requestId: string | null;
  error: string | null;
}

function resource<T>(value: T): Resource<T> {
  return { value, requestId: null, error: null };
}

const initialState = {
  catalog: resource<SoilResult<SoilType[]> | null>(null),
  feed: resource<SoilResult<SoilType | null> | null>(null),
  draft: resource<SoilType | null>(null),
  mutation: resource<null>(null),
};

export const soilTypesReducer = createSlice({
  name: "soilTypes",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadSoilTypes.pending, (state, action) => {
        state.catalog.requestId = action.meta.requestId;
        state.catalog.error = null;
      })
      .addCase(loadSoilTypes.fulfilled, (state, action) => {
        if (state.catalog.requestId !== action.meta.requestId) return;
        state.catalog = resource(action.payload);
      })
      .addCase(loadSoilTypes.rejected, (state, action) => {
        if (state.catalog.requestId !== action.meta.requestId) return;
        state.catalog.requestId = null;
        state.catalog.error = action.payload ?? null;
      })
      .addCase(loadSoilType.pending, (state, action) => {
        state.feed.requestId = action.meta.requestId;
        state.feed.error = null;
      })
      .addCase(loadSoilType.fulfilled, (state, action) => {
        if (state.feed.requestId !== action.meta.requestId) return;
        state.feed = resource(action.payload);
      })
      .addCase(loadSoilType.rejected, (state, action) => {
        if (state.feed.requestId !== action.meta.requestId) return;
        state.feed.requestId = null;
        state.feed.error = action.payload ?? null;
      })
      .addCase(loadSoilDraft.pending, (state, action) => {
        state.draft = { ...resource(null), requestId: action.meta.requestId };
      })
      .addCase(loadSoilDraft.fulfilled, (state, action) => {
        if (state.draft.requestId !== action.meta.requestId) return;
        state.draft = resource(action.payload);
      })
      .addCase(loadSoilDraft.rejected, (state, action) => {
        if (state.draft.requestId !== action.meta.requestId) return;
        state.draft = { ...resource(null), error: action.payload ?? null };
      })
      .addCase(createSoilDraft.fulfilled, (state, action) => {
        if (state.mutation.requestId !== action.meta.requestId) return;
        state.draft = resource(action.payload);
      })
      .addCase(publishSoilType.fulfilled, (state, action) => {
        if (state.mutation.requestId !== action.meta.requestId) return;
        state.draft = resource(null);
      })
      .addCase(deleteSoilType.fulfilled, (state, action) => {
        if (state.mutation.requestId !== action.meta.requestId) return;
        const catalog = state.catalog.value;
        if (catalog) catalog.data = catalog.data.filter((soil) => soil.id !== action.payload);
      })
      .addCase(likeSoilType.fulfilled, (state, action) => {
        if (state.mutation.requestId !== action.meta.requestId) return;
        const { id, likesCount, isLiked } = action.payload;
        for (const soil of [state.feed.value?.data, state.catalog.value?.data.find((item) => item.id === id)]) {
          if (soil?.id !== id) continue;
          soil.likesCount = likesCount;
          soil.isLiked = isLiked;
        }
      })
      .addMatcher(isAnyOf(signedIn, signedOut), () => initialState)
      .addMatcher(isAnyOf(createSoilDraft.pending, publishSoilType.pending, deleteSoilType.pending, likeSoilType.pending), (state, action) => {
        state.mutation = { ...resource(null), requestId: action.meta.requestId };
      })
      .addMatcher(isAnyOf(createSoilDraft.fulfilled, publishSoilType.fulfilled, deleteSoilType.fulfilled, likeSoilType.fulfilled), (state, action) => {
        if (state.mutation.requestId === action.meta.requestId) state.mutation = resource(null);
      })
      .addMatcher(isAnyOf(createSoilDraft.rejected, publishSoilType.rejected, deleteSoilType.rejected, likeSoilType.rejected), (state, action) => {
        if (state.mutation.requestId !== action.meta.requestId) return;
        state.mutation = { ...resource(null), error: action.payload ?? null };
      });
  },
}).reducer;
