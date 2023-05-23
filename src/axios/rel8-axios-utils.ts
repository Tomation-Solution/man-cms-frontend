import axios, { AxiosHeaders } from "axios";
import { REL8_URL } from "./axios-utils";
import useRel8AuthStore from "../zustand/rel8-store";

const rel8PrivateRequest = axios.create({
  baseURL: REL8_URL,
});

rel8PrivateRequest.interceptors.request.use((config) => {
  const rel8UserData = useRel8AuthStore.getState().user;

  (config.headers as AxiosHeaders).set(
    "Authorization",
    `Token ${rel8UserData?.token}`
  );
  return config;
});

export default rel8PrivateRequest;
