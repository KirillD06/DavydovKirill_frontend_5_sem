import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { Api } from "../api/generated/backend";
import type { PublishSoilTypeDto, SoilTypeResponseDto } from "../api/generated/backend";
import { errorMessage } from "../api/errors";
import { SOIL_TYPES, filterSoilTypes, findSoilType, nextSoilType } from "../data/soil-types";
import type { SoilType } from "../types/soil-type";
import type { User } from "../api/users";

const soilTypesApi = new Api({ baseURL: "/", timeout: 6000 }).api;
const soilThunk = createAsyncThunk.withTypes<{
  state: { auth: { user: User | null } };
  rejectValue: string;
}>();

type Source = "server" | "mock";
export interface SoilResult<T> {
  data: T;
  source: Source;
}
type FeedQuery = { id?: number; next?: "true" };

function useMock(error: unknown, user: User | null) {
  if (user || !isAxiosError(error)) return false;
  const response = error.response;
  return !response || [502, 503, 504].includes(response.status) ||
    (response.status === 500 && response.data === "");
}

function mediaPath(value: string | null) {
  if (!value) return "";
  const bucketPath = /^https?:\/\/[^/]+(\/soil-types\/[^?#]+(?:\?[^#]*)?)$/i.exec(value);
  return bucketPath ? `/s3${bucketPath[1]}` : "";
}

function normalize(soil: SoilTypeResponseDto, user: User | null): SoilType {
  return {
    ...soil,
    description: soil.description ?? "",
    imageUrl: mediaPath(soil.imageUrl),
    videoUrl: mediaPath(soil.videoUrl),
    isLiked: user ? soil.isLiked : 0,
    isMine: user ? soil.isMine : 0,
  };
}

export const loadSoilTypes = soilThunk<SoilResult<SoilType[]>, number>(
  "soilTypes/loadCatalog",
  async (maxLoosening, { signal, getState, rejectWithValue }) => {
    const { user } = getState().auth;
    try {
      const { data } = await soilTypesApi.soilTypesApiControllerList({ maxLoosening }, { signal });
      return { data: data.map((soil) => normalize(soil, user)), source: "server" };
    } catch (error) {
      if (!signal.aborted && useMock(error, user)) {
        return { data: filterSoilTypes(maxLoosening), source: "mock" };
      }
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const loadSoilType = soilThunk<SoilResult<SoilType | null>, FeedQuery>(
  "soilTypes/loadFeed",
  async (query, { signal, getState, rejectWithValue }) => {
    const { user } = getState().auth;
    try {
      const { data } = await soilTypesApi.soilTypesApiControllerFeed(query, { signal });
      return { data: normalize(data, user), source: "server" };
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return { data: null, source: "server" };
      }
      if (!signal.aborted && useMock(error, user)) {
        const soil = query.id === undefined
          ? SOIL_TYPES[0]
          : query.next
            ? nextSoilType(query.id, SOIL_TYPES)
            : findSoilType(String(query.id));
        return { data: soil ?? null, source: "mock" };
      }
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const loadSoilDraft = soilThunk<SoilType | null, void>(
  "soilTypes/loadDraft",
  async (_, { signal, getState, rejectWithValue }) => {
    try {
      const { data } = await soilTypesApi.soilTypesApiControllerDraft({ signal });
      return normalize(data, getState().auth.user);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const createSoilDraft = soilThunk<SoilType, { name: string; image?: File; video?: File }>(
  "soilTypes/createDraft",
  async (fields, { getState, rejectWithValue }) => {
    try {
      const { data: { id } } = await soilTypesApi.soilTypesApiControllerCreate(fields);
      const { data } = await soilTypesApi.soilTypesApiControllerDraft();
      if (data.id !== id) return rejectWithValue("Черновик изменился. Откройте страницу добавления снова.");
      return normalize(data, getState().auth.user);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const publishSoilType = soilThunk<void, { id: number; fields: PublishSoilTypeDto }>(
  "soilTypes/publish",
  async ({ id, fields }, { rejectWithValue }) => {
    try {
      await soilTypesApi.soilTypesApiControllerPublish(id, fields);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const deleteSoilType = soilThunk<number, number>(
  "soilTypes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await soilTypesApi.soilTypesApiControllerRemove(id);
      return id;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const likeSoilType = soilThunk<SoilTypeResponseDto, { id: number; value: 0 | 1 }>(
  "soilTypes/like",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      return (await soilTypesApi.soilTypesApiControllerLike(id, { value })).data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);
