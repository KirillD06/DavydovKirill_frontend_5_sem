import axios from "axios";

export interface User {
  id: number;
  login: string;
  isModerator: boolean;
}

export interface Credentials {
  login: string;
  password: string;
}

const client = axios.create({ baseURL: "/api/users", timeout: 6000 });

export async function loginUser(credentials: Credentials) {
  return (await client.post<User>("/login", credentials)).data;
}

export async function registerUser(credentials: Credentials) {
  await client.post("/register", credentials);
}

export async function logoutUser() {
  await client.post("/logout");
}
