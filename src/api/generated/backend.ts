/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SoilTypeResponseDto {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  looseningFactor: number | null;
  density: number | null;
  likesCount: number;
  isLiked: 0 | 1;
  isMine: 0 | 1;
}

export interface CreatedSoilTypeDto {
  /** @example 8 */
  id: number;
}

export interface PublishSoilTypeDto {
  /**
   * @maxLength 1000
   * @example "Крупнообломочный грунт с песчаным заполнителем"
   */
  description: string;
  /**
   * @min 1
   * @max 2
   * @example 1.18
   */
  looseningFactor: number;
  /**
   * @min 0.5
   * @max 3
   * @example 1.95
   */
  density: number;
}

export interface LikeDto {
  /** @example 1 */
  value: 0 | 1;
}

export interface RegisterUserDto {
  /**
   * @maxLength 50
   * @example "engineer"
   */
  login: string;
  /**
   * @format password
   * @minLength 4
   * @maxLength 100
   * @example "pass1234"
   */
  password: string;
}

export interface UserResponseDto {
  id: number;
  login: string;
  isModerator: boolean;
}

export interface LoginUserDto {
  /**
   * @maxLength 50
   * @example "user1"
   */
  login: string;
  /**
   * @format password
   * @maxLength 100
   * @example "pass1"
   */
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Типы грунта
 * @version 4.0
 * @contact
 *
 * 10 методов. Далее: name, image, video. Публикация: description, looseningFactor, density. Вход устанавливает HttpOnly cookie; Swagger отправляет её автоматически.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Типы грунта
     * @name SoilTypesApiControllerList
     * @summary 1. Каталог типов грунта с фильтром
     * @request GET:/api/soil_types
     */
    soilTypesApiControllerList: (
      query?: {
        /**
         * @min 1
         * @example 1.2
         */
        maxLoosening?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SoilTypeResponseDto[], void>({
        path: `/api/soil_types`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Три входных поля. Фото и видео необязательны. Ответ содержит только id нового черновика.
     *
     * @tags Типы грунта
     * @name SoilTypesApiControllerCreate
     * @summary 4. Далее — создать тип грунта
     * @request POST:/api/soil_types
     * @secure
     */
    soilTypesApiControllerCreate: (
      data: {
        /**
         * @maxLength 100
         * @example "Гравий"
         */
        name: string;
        /** @format binary */
        image?: File;
        /** @format binary */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<CreatedSoilTypeDto, void>({
        path: `/api/soil_types`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Один метод: без id — первый грунт; id — выбранный; id и next=true — следующий.
     *
     * @tags Типы грунта
     * @name SoilTypesApiControllerFeed
     * @summary 2. Лента типов грунта
     * @request GET:/api/soil_types/feed
     */
    soilTypesApiControllerFeed: (
      query?: {
        /**
         * Без id — первый опубликованный тип грунта
         * @min 1
         * @example 1
         */
        id?: number;
        /** true — следующий после id по кругу */
        next?: "true" | "false";
      },
      params: RequestParams = {},
    ) =>
      this.request<SoilTypeResponseDto, void>({
        path: `/api/soil_types/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Типы грунта
     * @name SoilTypesApiControllerDraft
     * @summary 3. Черновик текущего пользователя
     * @request GET:/api/soil_types/draft
     * @secure
     */
    soilTypesApiControllerDraft: (params: RequestParams = {}) =>
      this.request<SoilTypeResponseDto, void>({
        path: `/api/soil_types/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Типы грунта
     * @name SoilTypesApiControllerPublish
     * @summary 5. Опубликовать тип грунта
     * @request PUT:/api/soil_types/{id}/publish
     * @secure
     */
    soilTypesApiControllerPublish: (
      id: number,
      data: PublishSoilTypeDto,
      params: RequestParams = {},
    ) =>
      this.request<SoilTypeResponseDto, void>({
        path: `/api/soil_types/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Типы грунта
     * @name SoilTypesApiControllerRemove
     * @summary 6. Удалить свой тип грунта
     * @request DELETE:/api/soil_types/{id}
     * @secure
     */
    soilTypesApiControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/soil_types/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Типы грунта
     * @name SoilTypesApiControllerLike
     * @summary 7. Поставить или снять лайк
     * @request POST:/api/soil_types/{id}/like
     * @secure
     */
    soilTypesApiControllerLike: (
      id: number,
      data: LikeDto,
      params: RequestParams = {},
    ) =>
      this.request<SoilTypeResponseDto, void>({
        path: `/api/soil_types/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name UsersControllerRegister
     * @summary 8. Зарегистрировать пользователя
     * @request POST:/api/users/register
     */
    usersControllerRegister: (
      data: RegisterUserDto,
      params: RequestParams = {},
    ) =>
      this.request<UserResponseDto, any>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name UsersControllerLogin
     * @summary 9. Войти и установить cookie sessionId
     * @request POST:/api/users/login
     */
    usersControllerLogin: (data: LoginUserDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name UsersControllerLogout
     * @summary 10. Выйти и удалить сессию из Redis
     * @request POST:/api/users/logout
     */
    usersControllerLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout`,
        method: "POST",
        ...params,
      }),
  };
}
