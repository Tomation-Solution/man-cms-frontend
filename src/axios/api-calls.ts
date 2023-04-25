import axios, { AxiosError } from "axios";
import { User } from "../zustand/store";
import privateRequest from "./axios-utils";

const BASE_URL = "http://127.0.0.1:8000/api";

//LOGIN
export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const loginURL = `${BASE_URL}/auth/login`;
    const res = await axios.post(loginURL, user);
    return res.data;
  } catch (error: any) {
    if (!error?.response) {
      throw new Error("No Server Response");
    } else if (error?.response.status === 400) {
      throw new Error("Invalid Credentials");
    } else if (error?.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw new Error("Login Failed");
    }
  }
};

//LOG OUT
export const logoutUser = async (payload: { refresh: string }) => {
  try {
    const res = await privateRequest.post("/auth/token/blacklist/", payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//PUBLICATIONS
export const publicationCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post("/publications/", payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const publicationGetAll = async () => {
  try {
    const res = await privateRequest.get("/publications/");
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const publicationRetrieve = async (pubid: number) => {
  try {
    const res = await privateRequest.get(`/publications/${pubid}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const publicationUpdate = async (data: {
  pubid: number;
  FormDataHandler: any;
}) => {
  const { pubid, FormDataHandler } = data;
  try {
    const res = await privateRequest.put(
      `/publications/${pubid}`,
      FormDataHandler
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const publicationDelete = async (id: number) => {
  try {
    const res = await privateRequest.delete(`/publications/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//NEWS
export const newsCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/news/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const newsGetAll = async () => {
  try {
    const res = await privateRequest.get(`/news/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const newsRetrieve = async (newsId: number) => {
  try {
    const res = await privateRequest.get(`/news/${newsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const newsUpdate = async (payload: any) => {
  const { newsId, FormDataHandler } = payload;
  try {
    const res = await privateRequest.put(`/news/${newsId}`, FormDataHandler);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const newsDelete = async (newsId: number) => {
  try {
    const res = await privateRequest.delete(`/news/${newsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//REPORTS
export const reportsCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/reports/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const reportsGetAll = async () => {
  try {
    const res = await privateRequest.get(`/reports/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const reportsRetrieve = async (reportsId: number) => {
  try {
    const res = await privateRequest.get(`/reports/${reportsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const reportsUpdate = async (payload: any) => {
  const { reportId, FormDataHandler } = payload;
  try {
    const res = await privateRequest.put(
      `/reports/${reportId}`,
      FormDataHandler
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const reportsDelete = async (reportsId: number) => {
  try {
    const res = await privateRequest.delete(`/reports/${reportsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//EVENTS
export const eventsCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/events/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const eventsGetAll = async () => {
  try {
    const res = await privateRequest.get(`/events/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const eventsRetrieve = async (eventsId: number) => {
  try {
    const res = await privateRequest.get(`/events/${eventsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const eventsUpdate = async (payload: any) => {
  const { eventsId, FormDataHandler } = payload;
  try {
    const res = await privateRequest.put(
      `/events/${eventsId}`,
      FormDataHandler
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const eventsDelete = async (eventsId: number) => {
  try {
    const res = await privateRequest.delete(`/events/${eventsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//TRAININGS
export const trainingsCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/trainings/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const trainingsGetAll = async () => {
  try {
    const res = await privateRequest.get(`/trainings/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const trainingsRetrieve = async (trainingsId: number) => {
  try {
    const res = await privateRequest.get(`/trainings/${trainingsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const trainingsUpdate = async (payload: any) => {
  const { trainingsId, FormDataHandler } = payload;
  try {
    const res = await privateRequest.put(
      `/trainings/${trainingsId}`,
      FormDataHandler
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const trainingsDelete = async (trainingsId: number) => {
  try {
    const res = await privateRequest.delete(`/trainings/${trainingsId}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//ABOUT US
//HISTORY
export const historyUpdate = async (payload: any) => {
  try {
    const res = await privateRequest.put(`/aboutus/history`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const historyRetrieve = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/history`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//ADVOCACY
export const advocacyUpdate = async (payload: any) => {
  try {
    const res = await privateRequest.put(`/aboutus/advocacy`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const advocacyRetrieve = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/advocacy`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//AFFILLIATES
export const affilliatesUpdate = async (payload: any) => {
  try {
    const res = await privateRequest.put(`/aboutus/affilliate`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const affilliatesRetrieve = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/affilliate`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//HOW WE WORK
export const howWeWorkUpdate = async (payload: any) => {
  try {
    const res = await privateRequest.put(`/aboutus/how-we-work`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const howWeWorkRetrieve = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/how-we-work`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//How We Operate
export const howWeOperateUpdate = async (payload: any) => {
  try {
    const res = await privateRequest.put(`/aboutus/how-we-operate`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const howWeOperateRetrieve = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/how-we-operate`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//OPERATE OFFICE
export const operateOfficeCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(
      `/aboutus/how-we-operate/office`,
      payload
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateOfficeGetAll = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/how-we-operate/office`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateOfficeRetrieve = async (id: any) => {
  try {
    const res = await privateRequest.get(
      `/aboutus/how-we-operate/office/${id}`
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateOfficeUpdate = async (payload: any) => {
  const { id, data } = payload;
  try {
    const res = await privateRequest.put(
      `/aboutus/how-we-operate/office/${id}`,
      data
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateOfficeDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(
      `/aboutus/how-we-operate/office/${id}`
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//OPERATE BRANCH
export const operateBranchCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(
      `/aboutus/how-we-operate/branch`,
      payload
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateBranchGetAll = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/how-we-operate/branch`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateBranchRetrieve = async (id: any) => {
  try {
    const res = await privateRequest.get(
      `/aboutus/how-we-operate/branch/${id}`
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateBranchUpdate = async (payload: any) => {
  const { id, data } = payload;
  try {
    const res = await privateRequest.put(
      `/aboutus/how-we-operate/branch/${id}`,
      data
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const operateBranchDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(
      `/aboutus/how-we-operate/branch/${id}`
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//CONTACT
export const contactGetAll = async () => {
  try {
    const res = await privateRequest.get(`/aboutus/contact`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};
export const contactDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(`/aboutus/contact/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//WHY JOIN
export const whyJoinCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/membership/why-join`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const whyJoinGetAll = async () => {
  try {
    const res = await privateRequest.get(`/membership/why-join`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const whyJoinRetrieve = async (id: any) => {
  try {
    const res = await privateRequest.get(`/membership/why-join/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const whyJoinUpdate = async (payload: any) => {
  const { id, data } = payload;
  try {
    const res = await privateRequest.put(`/membership/why-join${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const whyJoinDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(`/membership/why-join${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};
