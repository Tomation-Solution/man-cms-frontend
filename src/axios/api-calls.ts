import axios, { Axios, AxiosError } from "axios";
import { User } from "../zustand/store";
import privateRequest, { BASE_URL, rel8Request } from "./axios-utils";
import { ServicePageCreationType } from "../components/Modals/ServicePageModals/ServicePageModals";
import { MPDCLType } from "../components/Modals/MPDCLModal";
import { SectoralGroupTabSchemaType } from "../components/Modals/SectoralGroupModal";
import { WhyChooseUsType } from "../components/Modals/HomePageManagement/WhyChooseUse";
import { HomePageContentType } from "../pages/HomePageManagement/_components/HomePageContent";
import rel8PrivateRequest from "./rel8-axios-utils";
import { tryCatch } from "../utils/extraFunction";
import { createSliderschemaType } from "../components/HomePageSlider/_components/CreateSlider";
import { containsActualText } from "../utils";
import { MPDCLPageContentSchemaFormType } from "../pages/Structure/_components/MDPCLPageContent";
import { MrcPageContentTabschemaType } from "../pages/Structure/_components/MRCPageContent";
import { EventAndMediaContentType } from "../pages/events&media";
import { MrcContactPageSchemaType } from "../pages/Structure/_components/MRCContact";
import {
  CreateUserPayload,
  CreateUserResponse,
  LoginPayload,
  LoginResponse,
  LogoutPayload,
} from "./auth.types";

//LOGIN
export const loginUser = async (user: LoginPayload): Promise<LoginResponse> => {
  try {
    const loginURL = `${BASE_URL}/auth/login`;
    const res = await axios.post(loginURL, user);
    return res.data;
  } catch (error: any) {
    if (!error?.response) {
      throw new Error("No Server Response");
    } else if (error.response.status === 400) {
      throw new Error("Invalid Credentials");
    } else if (error.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw new Error("Login Failed");
    }
  }
};

//LOG OUT
export const logoutUser = async (payload: LogoutPayload) => {
  try {
    const res = await privateRequest.post("/auth/token/blacklist/", payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const createUserApi = async ({
  email,
  password,
  userType,
}: CreateUserPayload): Promise<CreateUserResponse> => {
  const resp = await privateRequest.post(
    `/auth/create-account/?user_type=${userType}`,
    { email, password }
  );
  return resp.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    return res.data; // returns new access token
  } catch (error) {
    throw new Error("Unable to refresh token");
  }
};

// Types for password reset
export type RequestResetPayload = {
  email: string;
  frontend_url: string;
};

export type ConfirmResetPayload = {
  token: string;
  password: string;
  confirm_password: string;
};

export type AdminResetPayload = {
  user_id: string | number;
};

// Request password reset
export const requestPasswordReset = async (
  payload: RequestResetPayload
): Promise<any> => {
  try {
    const resetURL = `${BASE_URL}/auth/password-reset/request/`;
    const res = await axios.post(resetURL, payload);
    return res.data;
  } catch (error: any) {
    if (!error?.response) {
      throw new Error("No Server Response");
    } else if (error.response.status === 400) {
      throw new Error(error.response.data?.detail || "Invalid request");
    } else {
      throw new Error("Password reset request failed");
    }
  }
};

// Confirm password reset with token and new password
export const confirmPasswordReset = async (
  payload: ConfirmResetPayload
): Promise<any> => {
  try {
    const resetURL = `${BASE_URL}/auth/password-reset/confirm/`;
    const res = await axios.post(resetURL, payload);
    return res.data;
  } catch (error: any) {
    if (!error?.response) {
      throw new Error("No Server Response");
    } else if (error.response.status === 400) {
      // Get detailed error message if available
      const errorMsg =
        error.response.data?.token ||
        error.response.data?.password ||
        error.response.data?.detail ||
        "Invalid reset request";
      throw new Error(errorMsg);
    } else {
      throw new Error("Password reset failed");
    }
  }
};

// Admin initiated password reset (requires authentication)
export const adminResetPassword = async (
  payload: AdminResetPayload
): Promise<any> => {
  try {
    const res = await privateRequest.post(
      "/auth/admin/password-reset/",
      payload
    );
    return res.data;
  } catch (error: any) {
    if (!error?.response) {
      throw new Error("No Server Response");
    } else if (error.response.status === 403) {
      throw new Error("You don't have permission to perform this action");
    } else if (error.response.status === 404) {
      throw new Error("User not found");
    } else {
      throw new Error(error.response.data?.error || "Password reset failed");
    }
  }
};

export const getAdminUserById = async (id: number | string) => {
  // Return early if no valid ID is provided
  if (id === "") {
    return null;
  }

  try {
    const res = await privateRequest.get(`/admin/${id}`);
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

export const publicationGetAll = async (url: string) => {
  try {
    const res = await privateRequest.get(url);
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
    const res = await privateRequest.patch(
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

export const publicationTypesGetAll = async () => {
  try {
    const res = await privateRequest.get(`/publications/type`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const publicationTypesRename = async (payload: any) => {
  const { id, ...data } = payload;
  try {
    const res = await privateRequest.patch(`/publications/type/${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const publicationTypesDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(`/publications/type/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const publicationTypesCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/publications/type`, payload);
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

export const newsGetAll = async (url: string) => {
  try {
    const res = await privateRequest.get(url);
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
    const res = await privateRequest.patch(`/news/${newsId}`, FormDataHandler);
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

export const reportsGetAll = async (url: string) => {
  try {
    const res = await privateRequest.get(url);
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

// MEDIA AND EVENTS
export const getMediaAndEventContent =
  async (): Promise<EventAndMediaContentType> => {
    try {
      const res = await privateRequest.get("/events/event-media/");
      return res.data;
    } catch (e: any) {
      throw new AxiosError(e);
    }
  };

export const updateMediaAndEventContent = async (
  payload: FormData
): Promise<EventAndMediaContentType> => {
  try {
    const res = await privateRequest.put(
      "/events/event-media/update/",
      payload
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//EVENTS
export const getEventBanner = async () => {
  try {
    const res = await privateRequest.get(`/events/event-banner/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateEventBanner = async (payload: { banner_image?: any }) => {
  try {
    const formData = new FormData();
    if (typeof payload.banner_image !== "string") {
      formData.append("banner_image", payload.banner_image[0]);
    }

    const res = await privateRequest.patch(
      `/events/event-banner/update/`,
      formData
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const eventsCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/events/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const eventsGetAll = async (params?: Record<string, any>) => {
  try {
    const res = await privateRequest.get(`/events/`, { params });
    console.log({ res });

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const getCurrentAgmEvent = async () => {
  try {
    const res = await privateRequest.get(
      `/events/?is_agm=true&is_current_agm=true`
    );
    console.log({ res });

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

export const eventsPartialUpdate = async (payload: any) => {
  const { eventsId, FormDataHandler } = payload;
  console.log(payload);

  try {
    const res = await privateRequest.patch(
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
export const getTrainingsBanner = async () => {
  try {
    const res = await privateRequest.get(`/trainings/training-banner/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateTrainingsBanner = async (payload: {
  banner_image?: any;
}) => {
  try {
    const formData = new FormData();
    if (typeof payload.banner_image !== "string") {
      formData.append("banner_image", payload.banner_image[0]);
    }

    const res = await privateRequest.patch(
      `/trainings/training-banner/update/`,
      formData
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const trainingsCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/trainings/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const trainingsGetAll = async (params?: Record<string, any>) => {
  try {
    const res = await privateRequest.get(`/trainings/`, { params });
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
export const contactGetAll = async (params?: Record<string, any>) => {
  try {
    const res = await privateRequest.get(`/aboutus/contact`, { params });
    console.log({ res });

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const contactGetDownload = async (params?: {
  format: "pdf" | "csv";
  [key: string]: any;
}) => {
  try {
    const res = await privateRequest.post(
      `/aboutus/contact/download/`,
      params,
      {
        responseType: "blob",
      }
    );

    const format = params?.format.toLowerCase();
    const contentType = format === "csv" ? "text/csv" : "application/pdf";
    const fileExtension = format === "csv" ? "csv" : "pdf";
    const filename = `aboutus_contacts.${fileExtension}`;

    const blob = new Blob([res.data], { type: contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
    return true;
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
    const res = await privateRequest.put(`/membership/why-join/${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const whyJoinDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(`/membership/why-join/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//JOIN STEP
export const joinStepCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/membership/join-step`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const joinStepGetAll = async () => {
  try {
    const res = await privateRequest.get(`/membership/join-step`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const joinStepRetrieve = async (id: any) => {
  try {
    const res = await privateRequest.get(`/membership/join-step/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const joinStepUpdate = async (payload: any) => {
  const { id, data } = payload;
  try {
    const res = await privateRequest.put(`/membership/join-step/${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const joinStepDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(`/membership/join-step/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//FAQ
export const faqCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/membership/faq`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const faqGetAll = async (url: string) => {
  try {
    const res = await privateRequest.get(url);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const faqRetrieve = async (id: any) => {
  try {
    const res = await privateRequest.get(`/membership/faq/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const faqUpdate = async (payload: any) => {
  const { id, data } = payload;
  try {
    const res = await privateRequest.put(`/membership/faq/${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const faqDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(`/membership/faq/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//OUR MEMBERS
export const getOurMembersBanner = async () => {
  try {
    const res = await privateRequest.get(`/membership/our-members-banner/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateOurMembersBanner = async (payload: {
  banner_image?: any;
}) => {
  try {
    const formData = new FormData();
    if (typeof payload.banner_image !== "string") {
      formData.append("banner_image", payload.banner_image[0]);
    }

    const res = await privateRequest.patch(
      `/membership/our-members-banner/update/`,
      formData
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const getJoinStepBanner = async () => {
  try {
    const res = await privateRequest.get(`/membership/join-step-banner/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateJoinStepBanner = async (payload: { banner_image?: any }) => {
  try {
    const formData = new FormData();
    if (typeof payload.banner_image !== "string") {
      formData.append("banner_image", payload.banner_image[0]);
    }

    const res = await privateRequest.patch(
      `/membership/join-step-banner/update/`,
      formData
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const getWhyJoinBanner = async () => {
  try {
    const res = await privateRequest.get(`/membership/why-join-banner/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateWhyJoinBanner = async (payload: { banner_image?: any }) => {
  try {
    const formData = new FormData();
    if (typeof payload.banner_image !== "string") {
      formData.append("banner_image", payload.banner_image[0]);
    }

    const res = await privateRequest.patch(
      `/membership/why-join-banner/update/`,
      formData
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const ourMembersCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/membership/our-members`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const ourMembersGetAll = async () => {
  try {
    const res = await privateRequest.get(`/membership/our-members`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const ourMembersRetrieve = async (id: any) => {
  try {
    if (id === 0 || !id) return [];
    const res = await privateRequest.get(`/membership/our-members/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const ourMembersUpdate = async (payload: any) => {
  const { id, data } = payload;
  try {
    const res = await privateRequest.put(`/membership/our-members/${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const ourMembersDelete = async (id: any) => {
  try {
    const res = await privateRequest.delete(`/membership/our-members/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//GALLERY
export const galleryGetAll = async (url: string = "/gallery/") => {
  try {
    const res = await privateRequest.get(url);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryCreate = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/gallery/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryRetrieve = async (id: number, url?: string) => {
  try {
    const res = await privateRequest.get(url || `/gallery/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryDelete = async (id: number) => {
  try {
    const res = await privateRequest.delete(`/gallery/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryItemDelete = async (id: number) => {
  try {
    const res = await privateRequest.delete(`/gallery/gallery-item/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryItemAdd = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/gallery/gallery-item/add`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryItemRetrieve = async (id: number) => {
  try {
    const res = await privateRequest.get(`/gallery/gallery-item/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryItemUpdate = async (payloadx: any) => {
  const { id, payload } = payloadx;
  try {
    const res = await privateRequest.patch(
      `/gallery/gallery-item/${id}`,
      payload
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const galleryRename = async (payload: any) => {
  const { id, ...data } = payload;
  try {
    const res = await privateRequest.post(`/gallery/rename/${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//SERVICE REQUEST
export const serviceRequestGetAll = async (params: object = {}) => {
  try {
    const res = await privateRequest.get("/services/request-service", {
      params,
    });
    console.log({ res });

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const serviceRequestDownload = async (params: {
  format: "pdf" | "csv";
  [key: string]: any;
}) => {
  try {
    const res = await privateRequest.post(
      "/services/request-services/download",
      params,
      {
        responseType: "blob", // Important for both CSV and PDF
      }
    );

    const format = params.format.toLowerCase();
    const contentType = format === "csv" ? "text/csv" : "application/pdf";
    const fileExtension = format === "csv" ? "csv" : "pdf";
    const filename = `request_services.${fileExtension}`;

    const blob = new Blob([res.data], { type: contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
    return true;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//NEWS LETTER SUBSCRIPTIONS
export const newLetterGetAll = async (params: {
  page: number;
  page_size: number;
}) => {
  const response = await privateRequest.get(
    "/services/newsletter-subscription",
    { params }
  );
  return response.data;
};

export const updateNewsletterUI = async ({
  formData,
}: {
  formData: FormData;
}) => {
  const res = await privateRequest.put(
    `/services/newsletter-ui/update/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const newsletterUIGet = async () => {
  const res = await privateRequest.get("/services/newsletter-ui/");
  return res.data;
};

//PAYMENTS

export const publicationPayments = async (
  filters: Record<string, any> = {}
) => {
  try {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    const res = await privateRequest.get(
      `/payments/publication-payments/${queryString ? `?${queryString}` : ""}`
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const downloadPublicationPayments = async ({
  format = "pdf",
  payment_method = "",
  status = "",
  start_date = "",
  end_date = "",
}) => {
  const params = new URLSearchParams();

  // Default to past 1 month if dates are not provided
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const finalStartDate = start_date || oneMonthAgo.toISOString().split("T")[0];
  const finalEndDate = end_date || today.toISOString().split("T")[0];

  params.append("format", format);
  if (payment_method) params.append("payment_method", payment_method);
  if (status) params.append("status", status);
  params.append("start_date", finalStartDate);
  params.append("end_date", finalEndDate);

  try {
    const response = await privateRequest.get(
      `/payments/publication-payments/download/?${params.toString()}`,
      {
        responseType: "blob", // Important to get binary data
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    const filename =
      format === "csv"
        ? "publication_payments.csv"
        : "publication_payments.pdf";

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    throw new Error("Failed to download file");
  }
};

export const downloadEventAndTrainingPayments = async ({
  format = "pdf",
  options = "event",
  payment_method = "",
  status = "",
  start_date = "",
  end_date = "",
}) => {
  const params = new URLSearchParams();

  // Default to past 1 month if dates are not provided
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const finalStartDate = start_date || oneMonthAgo.toISOString().split("T")[0];
  const finalEndDate = end_date || today.toISOString().split("T")[0];

  params.append("format", format);
  params.append("options", options);
  if (payment_method) params.append("payment_method", payment_method);
  if (status) params.append("status", status);
  params.append("start_date", finalStartDate);
  params.append("end_date", finalEndDate);

  try {
    const response = await privateRequest.get(
      `/payments/event-training-registrations/download/?${params.toString()}`,
      {
        responseType: "blob", // Important to get binary data
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    const filename =
      format === "csv"
        ? "event-training-registrations.csv"
        : "event-training-registrations.pdf";

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download error:", error);
    throw new Error("Failed to download file");
  }
};

export const eventTrainingPaymentRegistration = async (
  currentPage: number,
  options: string = "event",
  filters: Record<string, any> = {}
) => {
  try {
    const params = new URLSearchParams();

    // Handle pagination
    params.append("page", currentPage.toString());

    // Append option
    params.append("options", options);

    // Append filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // Support range filter format: { date: { from: '2024-01-01', to: '2024-02-01' } }
      if (typeof value === "object" && value.from && value.to) {
        params.append(`${key}_from`, value.from);
        params.append(`${key}_to`, value.to);
      } else {
        params.append(key, String(value));
      }
    });

    const res = await privateRequest.get(
      `/payments/event-training-registrations/?${params.toString()}`
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//AGM
//INVITATIONS
export const getAllInvitations = async () => {
  try {
    const res = await privateRequest.get(`/payments/agm-invitation`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const invitationRegistration = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/payments/agm-invitation`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//MEMBERSHIP
export const agmMembershipRegistration = async () => {
  try {
    const res = await privateRequest.get(`/payments/member-agm-registration`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//EXHIBITOR
export const agmExhibitorRegistration = async () => {
  try {
    const res = await privateRequest.get(
      `/payments/exhibitor-agm-registration`
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//Other Registrations
export const agmOtherRegistration = async () => {
  try {
    const res = await privateRequest.get(`/payments/others-agm-registration`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//LUNCHEON
export const getAllLuncheonPrices = async () => {
  try {
    const res = await privateRequest.get(`/payments/luncheon/public`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateLuncheonPrices = async (payload: any) => {
  const { id, ...data } = payload;
  try {
    const res = await privateRequest.patch(`/payments/luncheon/${id}`, data);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//EXHIBITION BOOTS
export const getAllExhibitionBoots = async () => {
  try {
    const res = await privateRequest.get(`/payments/exhibition-boot`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const createExhibitionBoot = async (payload: any) => {
  try {
    const res = await privateRequest.post(`/payments/exhibition-boot`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const deleteExhibitionBoot = async (id: number) => {
  try {
    const res = await privateRequest.delete(`/payments/exhibition-boot/${id}`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateExhibitionBoot = async (payload: any) => {
  const { id, ...data } = payload;
  try {
    const res = await privateRequest.patch(
      `/payments/exhibition-boot/${id}`,
      data
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//QUICK REGISTRATIONS
export const makeQuickRegistrations = async (payload: any) => {
  try {
    const res = await privateRequest.post(
      `/payments/quick-agm-registration`,
      payload
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const getAllQuickRegistrations = async () => {
  try {
    const res = await privateRequest.get(`/payments/quick-agm-registration`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//REL8 Login
export const rel8Login = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const res = await rel8Request.post(`auth/login/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//REL8 post publication
export const rel8Publication = async (payload: any) => {
  try {
    const res = await rel8PrivateRequest.post(
      `publication/publicationview/`,
      payload
    );
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//REL8 post news
export const rel8News = async (payload: any) => {
  try {
    const res = await rel8PrivateRequest.post(`news/newsview/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//REL8 post event
export const rel8Event = async (payload: any) => {
  try {
    const res = await rel8PrivateRequest.post(`event/eventview/`, payload);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

// service
export const getServiceBanner = async () => {
  try {
    const res = await privateRequest.get(`/services/service-banner/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateServiceBanner = async (payload: any) => {
  try {
    const formData = new FormData();
    if (typeof payload.banner_image !== "string") {
      formData.append("banner_image", payload.banner_image[0]);
    }
    formData.append("mrc_desc", payload.mrc_desc);
    formData.append("mpdcl_desc", payload.mpdcl_desc);
    formData.append("core_desc", payload.core_desc);
    const res = await privateRequest.patch(
      `/services/service-banner/update/`,
      formData
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

type ServiceResponseType = {
  id: number;
  image: any;
  name: string;
  description: null | string;
  type: "CORE" | "MRC" | "MPDCL" | "OTHERS";
  created_at: string;
  updated_at: string;
  writer: number;
};
export const createService = async (
  data: ServicePageCreationType
): Promise<ServiceResponseType> => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("type", data.type || "CORE");
  form.append("description", data.description);
  form.append("image", data.image[0]);

  const res = await privateRequest.post("/services/all-services", form);
  return res.data;
};

export const getServices = async (url: string): Promise<any> => {
  const res = await privateRequest.get(url);
  return res.data;
};

export const deleteServiceApi = async (id: number): Promise<any> => {
  const res = await privateRequest.delete(`/services/all-services/${id}`);
  return res.data;
};

export const updateServiceApi = async ({
  data,
  id,
}: {
  data: ServicePageCreationType;
  id: number;
}): Promise<ServiceResponseType> => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("type", data.type || "CORE");
  form.append("description", data.description);
  if (typeof data.image !== "string") {
    form.append("image", data.image[0]);
  }
  const res = await privateRequest.put(`/services/all-services/${id}`, form);
  return res.data;
};

// mrc service
type createMrcApiProp = {
  name: string;
  description: string;
  small_text: string;
  items: string[];
  id?: number;
};
export const createMrcApi = async (data: createMrcApiProp) => {
  const res = await privateRequest.post(`/structure/mrc-service`, data);
  return res.data;
};

export const getMrcApi = async (): Promise<createMrcApiProp[]> => {
  const res = await privateRequest.get(`/structure/mrc-service`);
  return res.data.data;
};

export const deleteMrcApi = async (id: number): Promise<any> => {
  const res = await privateRequest.delete(`/structure/mrc-service/${id}`);
  return res.data.data;
};

export const updateMrcApi = async (data: createMrcApiProp): Promise<any> => {
  const res = await privateRequest.put(
    `/structure/mrc-service/${data.id}`,
    data
  );
  return res.data.data;
};

//get MPDCL
type MpdclType = {
  id: number;
  type: string;
  header: string;
  description: string;
  image: string | null;
};
export const getMpdclApi = async (): Promise<MpdclType[]> => {
  const resp = await privateRequest.get("/structure/mpdcl-service");
  return resp.data.data;
};

export const createMpdclApi = async ({
  data,
}: {
  data: MPDCLType;
}): Promise<MPDCLType> => {
  const form = new FormData();
  form.append("type", data.type);
  form.append("header", data.header);
  form.append("description", data.description);
  if (data.image) {
    form.append("image", data.image[0]);
  }
  const resp = await privateRequest.post("/structure/mpdcl-service", form);

  return resp.data;
};
export const updateMpdclApi = async ({
  data,
}: {
  data: MPDCLType;
}): Promise<MPDCLType> => {
  const form = new FormData();
  form.append("type", data.type);
  form.append("header", data.header);
  form.append("description", data.description);
  if (typeof data.image !== "string") {
    form.append("image", data.image[0]);
  }
  const resp = await privateRequest.put(
    `/structure/mpdcl-service/${data.id}`,
    form
  );

  return resp.data;
};

export const deleteMpdclApi = async (id: number): Promise<any> => {
  const res = await privateRequest.delete(`/structure/mpdcl-service/${id}`);
  return res.data.data;
};

// MRC Contact Page
export const getMrcContactPage = async (): Promise<any> => {
  const resp = await privateRequest.get(`/structure/mrc-contact`);
  return resp.data;
};

export const updateMrcContactPageApi = async (
  data: MrcContactPageSchemaType
): Promise<any> => {
  const resp = await privateRequest.patch(`/structure/mrc-contact`, data);
  return resp.data;
};

//MPDCLPageContent
export const getMPDCLPageContentApi = async (): Promise<any> => {
  const resp = await privateRequest.get(`/structure/mpdcl`);
  return resp.data;
};

export const updateMPDCLPageContentApi = async (
  data: MPDCLPageContentSchemaFormType
): Promise<any> => {
  const form = new FormData();
  if (typeof data.banner_image !== "string") {
    form.append("banner_image", data.banner_image[0]);
  }
  form.append("renewable_items", JSON.stringify(data.renewable_items));
  if (data.who_we_are) {
    form.append("who_we_are", data.who_we_are);
  }
  if (data.our_objectives_header) {
    form.append("our_objectives_header", data.our_objectives_header);
  }
  form.append("our_objectives_items", data.our_objectives_items);
  form.append("renewable_desc", data.renewable_desc);
  if (typeof data.renewable_image != "string") {
    form.append("renewable_image", data.renewable_image[0]);
  }
  const resp = await privateRequest.patch(`/structure/mpdcl`, form);
  return resp.data;
};

type MrcPageResponse = {
  banner_image?: any;
  objectives_card: {
    header: string;
    description: string;
  }[];
  who_we_are: string;
  objectives: string;
};
export const getMrcPage = async (): Promise<MrcPageResponse> => {
  const resp = await privateRequest.get(`structure/mrc`);
  return resp.data.data;
};

export const updateMrcPageApi = async (data: MrcPageContentTabschemaType) => {
  const formData = new FormData();

  // Append banner_image if it exists and is a file
  if (typeof data.banner_image !== "string") {
    formData.append("banner_image", data.banner_image[0]);
  }

  // Append simple text fields
  formData.append("who_we_are", data.who_we_are);
  formData.append("objectives", data.objectives);

  // Append the objectives_card array as JSON
  formData.append("objectives_card", JSON.stringify(data.objectives_card));

  const resp = await privateRequest.patch("structure/mrc", formData);
  return resp.data;
};

export const getSectorialBanner = async () => {
  try {
    const res = await privateRequest.get(`/structure/sectorial-banner/`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const updateSectorialBanner = async (payload: {
  banner_image?: any;
}) => {
  try {
    const formData = new FormData();
    if (typeof payload.banner_image !== "string") {
      formData.append("banner_image", payload.banner_image[0]);
    }

    const res = await privateRequest.patch(
      `/structure/sectorial-banner/update/`,
      formData
    );

    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const getSectoralGroupApi = async (page: number = 1) => {
  const res = await privateRequest.get(`structure/sectoral-group?page=${page}`);
  return res.data;
};

export const deleteSectoralGroupApi = async (id: number) => {
  const resp = await privateRequest.delete(`structure/sectoral-group/${id}`);
  return resp.data;
};
export const createUpdateSectoralGroupApi = async (
  data: SectoralGroupTabSchemaType
) => {
  let resp: any;
  let submit = new FormData();

  submit.append("header", data.header);
  submit.append("description", data.description);

  if (typeof data.image !== "string") {
    if (data.image) {
      submit.append("image", data.image[0]);
    }
  }

  console.log({ submit });
  if (data.id === undefined) {
    resp = await privateRequest.post("structure/sectoral-group", submit);
    return resp.data;
  }
  // submit.append('id',data.id.toString())

  resp = await privateRequest.put(
    `structure/sectoral-group/${data.id}`,
    submit
  );

  return resp.data;
};

// Manage Executive
type ExecutiveType = {
  id?: number;
  image?: string;
  name: string;
  title: string;
  tenor?: string;
  extra_title1?: string;
  extra_title2?: string;
  type: string;
  created_at?: string;
  updated_at?: string;
  order_position?: number;
};
export const getExecutiveApi = async (url: string): Promise<any> => {
  const resp = await privateRequest.get(url);
  console.log({ resp });
  return resp.data;
};

export const createExecutiveApi = async (data: ExecutiveType): Promise<any> => {
  try {
    const form = new FormData();
    form.append("name", data.name);
    form.append("title", data.title);
    form.append("type", data.type);
    form.append("tenor", data.tenor!);
    form.append("order_position", String(data.order_position!));
    if (data.extra_title1) {
      form.append("extra_title1", data.extra_title1);
    }
    if (data.extra_title2) {
      form.append("extra_title2", data.extra_title2);
    }
    if (data.image) {
      form.append("image", data.image[0]);
    }
    form.append("type", data.type);
    const resp = await privateRequest.post("aboutus/our-executives", form);
    return resp.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating executive");
  }
};

export const updateExecutiveApi = async (data: ExecutiveType): Promise<any> => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("title", data.title);
  form.append("type", data.type);
  form.append("tenor", data.tenor!);
  if (data.extra_title1) {
    form.append("extra_title1", data.extra_title1);
  }
  if (data.extra_title2) {
    form.append("extra_title2", data.extra_title2);
  }
  if (typeof data.image !== "string") {
    if (data.image) {
      form.append("image", data.image[0]);
    }
  }
  form.append("type", data.type);
  const resp = await privateRequest.put(
    `aboutus/our-executives/${data.id}`,
    form
  );
  return resp.data;
};

export const deleteExecutiveApi = async (id: number) => {
  const resp = await privateRequest.delete(`aboutus/our-executives/${id}`);
  return resp.data;
};

export type ProspectiveMembertype = {
  id: 8;
  form_one: [
    {
      cac_registration_number: string;
      prospective_member: number;
      name_of_company: string;
      tax_identification_number: string;
      corporate_office_addresse: string;
      office_bus_stop: string;
      office_city: string;
      office_lga: string;
      office_state: string;
      postal_addresse: string;
      telephone: string;
      email_addresse: string;
      website: string;
      factoru_details: string;
      legal_status_of_company: string;
      number_of_female_expatriates: number;
      number_of_male_expatriates: number;
      number_of_male_permanent_staff: number;
      number_of_female_permanent_staff: number;
      local_share_capital: string;
      foreign_share_capital: string;
      ownership_structure_equity_local: string;
      ownership_structure_equity_foregin: string;
      total_value_of_land_asset: string;
      total_value_of_building_asset: string;
      total_value_of_other_asset: string;
      installed_capacity: string;
      current_sales_turnover: string;
      projected_sales_turnover: string;
      are_your_product_exported: string;
      company_contact_infomation: string;
      designation: string;
      name_of_md_or_ceo_of_company: string;
      selectdate_of_registration: string;
      upload_signature: string;
      // "all_roduct_manufactured": "[{'product_manufactured':'whothey breat','certificates':'certifacet of thoe'}]",
      // "all_raw_materials_used": "[{'major_raw_materials':'j frhufr','major_raw_materials':'hello people'}]",
      all_roduct_manufactured: string;
      all_raw_materials_used: string;
    }
  ];
  form_two: [
    {
      corporate_affairs_commision: string | null;
      letter_of_breakdown_of_payment_and_docs_attached: string | null;
      first_year_of_buisness_plan: string | null;
      second_year_of_buisness_plan: string | null;
      photocopy_of_your_reciept_issued_on_purchase_of_applicant_form:
        | string
        | null;
      prospective_member: number;
    }
  ];
  name_of_company: string;
  telephone_number: string;
  cac_registration_number: string;
  email: string;
  website: string;
  corporate_office_addresse: string;
  has_paid: boolean;
  paystack: string;
  amount: string;
  subcription_amount: string;
  subcription_paystack: string;
  admin: string;
  has_paid_subcription: boolean;
  application_status: string;
  user: number;
};
// admin prospective member
export const getprospectiveMemberSubmission = async ({
  application_status = "approval_in_progress",
  executive_email,
}: {
  application_status?: string;
  executive_email?: string;
}): Promise<ProspectiveMembertype[]> => {
  let url = `prospectivemember/admin_manage_prospective_member/get_submissions/${
    application_status ? "?application_status=" + application_status : ""
  }`;
  if (executive_email) {
    url = `prospectivemember/admin_manage_prospective_member/get_submissions/${
      executive_email ? "?executive_email=" + executive_email : ""
    }${application_status ? "&application_status=" + application_status : ""}`;
  }
  const resp = await rel8Request.get(url);
  return resp.data.data;
};

export const getprospectiveMemberSubmissionDetail = async (
  id: number
): Promise<ProspectiveMembertype> => {
  const resp = await rel8Request.get(
    `prospectivemember/admin_manage_prospective_member/get_submissions/?id=${id}`
  );
  return resp.data.data;
};

export const updateRemarkOrStatus = async (data: {
  id: string;
  status?: string;
  remark?: string;
}) => {
  const resp = await rel8Request.post(
    `prospectivemember/admin_manage_prospective_member/update_prospective_status/`,
    data
  );
  return resp.data;
};

export const acknowledgeApplication = async (data: {
  id: number;
  email: string;
  content: string;
  password?: string;
}) => {
  const resp = await rel8Request.post(
    `prospectivemember/admin_manage_prospective_member/acknowledgement_of_application/`,
    data
  );
  return resp.data;
};

export const factoryInspection = async (data: any) => {
  const form = new FormData();
  form.append("id", data.id);
  form.append("file", data.file);
  const resp = await rel8Request.post(
    `prospectivemember/admin_manage_prospective_member/factory_inspection/`,
    form
  );
  return resp.data;
};
export const ReviewInspectionOfFactory = async ({
  id,
  decision,
  review,
}: {
  review: string;
  id: number | string;
  decision: string;
}) => {
  const form = new FormData();
  form.append("id", id.toString());
  form.append("review", review);
  form.append("decision", decision);
  const resp = await rel8Request.post(
    `prospectivemember/admin_manage_prospective_member/review_factory/`,
    form
  );
  return resp.data;
};

// whychoose use homepage management

export const createWhyChooseUsApi = async ({
  data,
}: {
  data: WhyChooseUsType;
}) => {
  const form = new FormData();

  form.append("heading", data.heading);
  form.append("description", data.description);
  form.append("image", data.image[0]);

  const resp = await privateRequest.post(`membership/why-we-are-unique/`, form);
  return resp.data;
};

export const updateWhyChooseUsApi = async ({
  data,
}: {
  data: WhyChooseUsType;
}) => {
  const form = new FormData();

  form.append("heading", data.heading);
  form.append("description", data.description);
  if (typeof data.image !== "string") {
    form.append("image", data.image[0]);
  }

  const resp = await privateRequest.put(
    `membership/why-we-are-unique/${data.id}/`,
    form
  );
  return resp.data;
};

export const deleteWhyChooseUsApi = async (id: number) => {
  const resp = await privateRequest.delete(
    `membership/why-we-are-unique/${id}`
  );
  return resp.data;
};

export const getWhyChooseUsApi = async (): Promise<WhyChooseUsType[]> => {
  const resp = await privateRequest.get(`membership/why-we-are-unique/`);
  return resp.data.data;
};

// home page content
export type HomePageContentServerResponse = {
  id: number;
  Logo: string;
  slider_welcome_message: string;
  slider_vision_message: string;
  slider_mission_message: string;
  vision_intro: string;
  mission_intro: string;
  advocacy_intro: string;
  history_intro: string;
  why_join_intro: string;
  members_intro: string;
  slider_image1: string | null;
  slider_image2: string | null;
  slider_image3: string | null;
  history_image: string | null;
  join_man_image: string | null;
};
export const getHomePageContent =
  async (): Promise<HomePageContentServerResponse> => {
    const resp = await privateRequest.get(`membership/home-main/`);
    console.log(resp.data);

    return resp.data.data;
  };

export const updateHomePageContent = async (
  data: HomePageContentType
): Promise<HomePageContentServerResponse> => {
  const form = new FormData();

  if (typeof data.Logo !== "string") {
    form.append("Logo", data.Logo[0]);
  }
  if (typeof data.slider_image1 !== "string") {
    form.append("slider_image1", data.slider_image1[0]);
  }
  if (typeof data.slider_image2 !== "string") {
    form.append("slider_image2", data.slider_image2[0]);
  }
  if (typeof data.slider_image3 !== "string") {
    form.append("slider_image3", data.slider_image3[0]);
  }
  if (typeof data.join_man_image !== "string") {
    form.append("join_man_image", data.join_man_image[0]);
  }
  if (typeof data.history_image !== "string") {
    form.append("history_image", data.history_image[0]);
  }
  form.append("slider_welcome_message", data.slider_welcome_message);
  form.append("slider_vision_message", data.slider_vision_message);
  form.append("slider_mission_message", data.slider_mission_message);

  if (containsActualText(data?.vision_intro))
    form.append("vision_intro", data.vision_intro);
  if (containsActualText(data?.mission_intro))
    form.append("mission_intro", data.mission_intro);
  if (containsActualText(data?.advocacy_intro))
    form.append("advocacy_intro", data.advocacy_intro);
  if (containsActualText(data?.history_intro))
    form.append("history_intro", data.history_intro);
  if (containsActualText(data?.why_join_intro))
    form.append("why_join_intro", data.why_join_intro);
  if (containsActualText(data?.members_intro))
    form.append("members_intro", data.members_intro);

  const resp = await privateRequest.put(`membership/home-main/`, form);
  return resp.data.data;
};
// Home Page Slider

export const getHomeSliderApi = async () => {
  const resp = await privateRequest.get("homepage/add-slider/get_slider/");
  return resp.data;
};

export const getHomeSliderWIthUrlApi = async (url: string) => {
  const resp = await privateRequest.get(url);
  return resp.data;
};

// export const createHomeSliderApi = async (data: createSliderschemaType) => {
//   const form = new FormData();
//   form.append("content", data.content);
//   form.append("title", data.title);
//   form.append("banner", data.banner);
//   const resp = await privateRequest.post("homepage/add-slider/", form);
//   return resp.data;
// };

export const createHomeSliderApi = async (data: createSliderschemaType) => {
  const form = new FormData();
  form.append("content", data.content);
  form.append("title", data.title);
  if (data.banner) {
    form.append("banner", data.banner);
  }
  if (data.order_position !== undefined) {
    form.append("order_position", data.order_position.toString());
  }
  const resp = await privateRequest.post("homepage/add-slider/", form);
  return resp.data;
};

// export const editHomeSliderApi = async (data: createSliderschemaType) => {
//   const form = new FormData();
//   form.append("content", data.content);
//   form.append("title", data.title);
//   if (data.banner) {
//     console.log("loggin banner");
//     form.append("banner", data.banner);
//   }
//   const resp = await privateRequest.patch(
//     `homepage/add-slider/${data?.id}/`,
//     form,
//     {
//       timeout: 60000, // Increase timeout to 60 seconds
//     }
//   );
//   return resp.data;
// };

export const editHomeSliderApi = async (data: createSliderschemaType) => {
  const form = new FormData();
  form.append("content", data.content);
  form.append("title", data.title);
  if (data.banner) {
    form.append("banner", data.banner);
  }
  if (data.order_position !== undefined) {
    form.append("order_position", data.order_position.toString());
  }
  const resp = await privateRequest.patch(
    `homepage/add-slider/${data?.id}/`,
    form,
    {
      timeout: 60000,
    }
  );
  return resp.data;
};

export const getArchivedSliderApi = async () => {
  const resp = await privateRequest.get(
    "homepage/add-slider/get_slider/?archived=true"
  );
  return resp.data;
};

export const archiveHomeSliderApi = async (id: number) => {
  const form = new FormData();
  const resp = await privateRequest.post(
    `homepage/add-slider/${id}/archive_slider/`,
    form,
    {
      timeout: 60000,
    }
  );
  return resp.data;
};

export const unArchiveHomeSliderApi = async (id: number) => {
  const form = new FormData();
  const resp = await privateRequest.post(
    `homepage/add-slider/${id}/archive_slider/?archived=true`,
    form,
    {
      timeout: 60000,
    }
  );
  return resp.data;
};

export const deleteHomeSliderApi = async (id: string | number) => {
  const resp = await privateRequest.delete(`homepage/add-slider/${id}/`);
  return resp.data;
};

//REVAMPED AGM SECTION

export const getAgmHomepage = async (params: any) => {
  try {
    const res = await privateRequest.get(`/agmcms/homepage`, { params });

    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const updateAgmHomepage = async (params: any, payload: any) => {
  try {
    const res = await privateRequest.patch(`/agmcms/homepage`, payload, {
      params,
    });
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const getAgmProgramme = async (params: any) => {
  try {
    const res = await privateRequest.get(`/agmcms/programme`, { params });

    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const updateAgmProgramme = async (params: any, payload: any) => {
  try {
    const res = await privateRequest.patch(`/agmcms/programme`, payload, {
      params,
    });
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const getAllAgmPrograms = async (params: any) => {
  try {
    const res = await privateRequest.get(`/agmcms/program`, { params });
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const createAgmProgram = async (params: any, payload: any) => {
  try {
    const res = await privateRequest.post(`/agmcms/program`, payload, {
      params,
    });
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const retrieveAgmProgram = async (id: any) => {
  try {
    if (id === 0) {
      return [];
    }
    const res = await privateRequest.get(`/agmcms/program/${id}`);
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const updateAgmProgram = async (data: { [key: string]: any }) => {
  try {
    const { id, formData } = data;
    if (id === 0) {
      return [];
    }
    const res = await privateRequest.patch(`/agmcms/program/${id}`, formData);
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const deleteAgmProgram = async (id: any) => {
  try {
    if (id === 0) {
      return [];
    }
    const res = await privateRequest.delete(`/agmcms/program/${id}`);
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const getAllAgmSpeakers = async (params: any) => {
  try {
    const res = await privateRequest.get(`/agmcms/speakers`, { params });
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const createAgmSpeaker = async (params: any, payload: any) => {
  try {
    const res = await privateRequest.post(`/agmcms/speakers`, payload, {
      params,
    });
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const retrieveAgmSpeaker = async (id: any) => {
  try {
    if (id === 0) {
      return [];
    }
    const res = await privateRequest.get(`/agmcms/speakers/${id}`);
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const updateAgmSpeaker = async (data: { [key: string]: any }) => {
  try {
    const { id, formData } = data;
    if (id === 0) {
      return [];
    }
    const res = await privateRequest.patch(`/agmcms/speakers/${id}`, formData);
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const deleteAgmSpeaker = async (id: any) => {
  try {
    if (id === 0) {
      return [];
    }
    const res = await privateRequest.delete(`/agmcms/speakers/${id}`);
    return res.data;
  } catch (error: any) {
    throw new AxiosError(error);
  }
};

export const getAllAgmExhibitionImages = tryCatch(async (params: any) => {
  const res = await privateRequest.get(`/agmcms/previous-exhibition-images`, {
    params,
  });
  return res.data;
});

export const createAgmExhibitionImage = tryCatch(async (payload: any) => {
  const res = await privateRequest.post(
    `/agmcms/previous-exhibition-images`,
    payload.data,
    { params: payload.params }
  );
  return res.data;
});

export const deleteAgmExhibitionImage = tryCatch(async (id: any) => {
  const res = await privateRequest.delete(
    `/agmcms/previous-exhibition-images/${id}`
  );
  return res.data;
});

export const getVenuePageContent = tryCatch(async (params: any) => {
  const res = await privateRequest.get(`/agmcms/venue`, { params });
  return res.data;
});

export const updateVenuePageContent = tryCatch(async (payload: any) => {
  const res = await privateRequest.patch(`/agmcms/venue`, payload.data, {
    params: payload.params,
  });
  return res.data;
});

export const getExhibitionPageContent = tryCatch(async (params: any) => {
  const res = await privateRequest.get(`/agmcms/exhibition`, { params });
  return res.data;
});

export const updateExhibtionPageContent = tryCatch(async (payload: any) => {
  const res = await privateRequest.patch(`/agmcms/exhibition`, payload.data, {
    params: payload.params,
  });
  return res.data;
});

export const getAllAgmFaq = tryCatch(async (params: any) => {
  const res = await privateRequest.get(`/agmcms/faq`, { params });
  return res.data;
});

export const createAgmFaq = tryCatch(async (payload: any) => {
  console.log(payload.data);

  const res = await privateRequest.post(`/agmcms/faq`, payload.data);
  return res.data;
});

export const retrieveAgmFaq = tryCatch(async (id: any) => {
  if (!id || id === 0) {
    return [];
  }

  const res = await privateRequest.get(`/agmcms/faq/${id}`);
  return res.data;
});

export const editAgmFaq = tryCatch(async (payload: any) => {
  const { id, formData } = payload;

  if (!id || id === 0) {
    return [];
  }

  const res = await privateRequest.patch(`/agmcms/faq/${id}`, formData);
  return res.data;
});

export const deleteAgmFaq = tryCatch(async (id: any) => {
  if (!id || id === 0) {
    return [];
  }

  const res = await privateRequest.delete(`/agmcms/faq/${id}`);
  return res.data;
});

//REVAMPED AGM SECTION

//ADVERTS
export const createAdvert = tryCatch(async (payload: any) => {
  const res = await privateRequest.post(`/membership/advertisement`, payload);
  return res.data;
});

export const getAllAdverts = tryCatch(async () => {
  const res = await privateRequest.get(`/membership/advertisement`);
  return res.data;
});

// export const updateAdvert = tryCatch(async (payload: any) => {
//   const { id, formData } = payload;

//   if (id === 0 || !id) {
//     return [];
//   }
//   const res = await privateRequest.patch(
//     `/membership/advertisement/${id}`,
//     formData
//   );
//   return res.data;
// });

// export const retrieveAdvert = tryCatch(async (id: any) => {
//   if (!id || id === 0) {
//     return [];
//   }

//   const res = await privateRequest.get(`/membership/advertisement/${id}`);
//   return res.data;
// });

export const deleteAdvert = tryCatch(async (id: any) => {
  if (!id || id === 0) {
    return [];
  }

  const res = await privateRequest.delete(`/membership/advertisement/${id}`);
  return res.data;
});
