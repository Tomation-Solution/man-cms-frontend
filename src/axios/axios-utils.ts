import axios, { AxiosHeaders, AxiosError } from "axios";
import { useAuthStore } from "../zustand/store";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

// const BASE_URL = `https://web-production-9688.up.railway.app/api`;

// export const BASE_URL = 'https://api.manufacturersnigeria.org/api'
export const BASE_URL = "http://localhost:8000/api";
export const REL8_URL =
  "https://rel8corporate.watchdoglogisticsng.com/tenant/man/tenant/";
// export const REL8_URL =
//   "http://localhost:8001/tenant/man/tenant/";
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
