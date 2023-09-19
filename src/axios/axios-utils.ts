import axios, { AxiosHeaders, AxiosError } from "axios";
import { useAuthStore } from "../zustand/store";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const BASE_URL = `http://23.254.238.194:8000/api`;
// const BASE_URL = "http://127.0.0.1:8000/api";
export const REL8_URL =
  "https://web-production-81544.up.railway.app/tenant/man/tenant/";
const privateRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const rel8Request = axios.create({
  baseURL: REL8_URL,
  // withCredentials: true,
});

privateRequest.interceptors.request.use(async (config) => {
  const userData = useAuthStore.getState().user;
  const setUserHandler = useAuthStore.getState().setUser;
  const deleteUserHandler = useAuthStore.getState().delUser;

  (config.headers as AxiosHeaders).set(
    "Authorization",
    `Bearer ${userData?.token.access}`
  );

  const access_decoded: any = jwtDecode(userData?.token.access as string);
  const isExpired = dayjs.unix(access_decoded.exp).diff(dayjs()) < 1;

  if (!isExpired) return config;

  try {
    const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
      refresh: userData?.token.refresh,
    });

    if (userData) {
      userData.token.access = response.data.access;

      setUserHandler(userData);
    }

    (config.headers as AxiosHeaders).set(
      "Authorization",
      `Bearer ${response.data.access}`
    );
  } catch (err) {
    const error = err as AxiosError;
    if (error.response?.status === 401) {
      deleteUserHandler();
      window.location.replace("/login");
    }
  }

  return config;
});

export default privateRequest;
