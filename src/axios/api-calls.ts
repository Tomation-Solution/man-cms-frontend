import axios, { AxiosError } from "axios";
import { User } from "../zustand/store";
import privateRequest, { rel8Request } from "./axios-utils";
import { ServicePageCreationType } from "../components/Modals/ServicePageModals/ServicePageModals";
import { MPDCLType } from "../components/Modals/MPDCLModal";
import {
  MPDCLPageContentSchemaFormType,
  MrcPageContentTabschemaType,
} from "../pages/Structure/StructurePage";
import { SectoralGroupTabSchemaType } from "../components/Modals/SectoralGroupModal";
import { WhyChooseUsType } from "../components/Modals/HomePageManagement/WhyChooseUse";
import { HomePageContentType } from "../pages/HomePageManagement";
import rel8PrivateRequest from "./rel8-axios-utils";

const BASE_URL = "https://web-production-9688.up.railway.app/api";
// const BASE_URL = "http://127.0.0.1:8000/api";

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

export const faqGetAll = async () => {
  try {
    const res = await privateRequest.get(`/membership/faq`);
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
export const galleryGetAll = async () => {
  try {
    const res = await privateRequest.get(`/gallery/`);
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

export const galleryRetrieve = async (id: number) => {
  try {
    const res = await privateRequest.get(`/gallery/${id}`);
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

export const galleryItemUpdate = async (payload: any) => {
  const { id, ...data } = payload;
  try {
    const res = await privateRequest.patch(`/gallery/gallery-item/${id}`, data);
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
export const serviceRequestGetAll = async () => {
  try {
    const res = await privateRequest.get(`/services/request-service`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//NEWS LETTER SUBSCRIPTIONS
export const newLetterGetAll = async () => {
  try {
    const res = await privateRequest.get(`/services/newsletter-subscription`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

//PAYMENTS
export const publicationPayments = async () => {
  try {
    const res = await privateRequest.get(`/payments/publications`);
    return res.data;
  } catch (e: any) {
    throw new AxiosError(e);
  }
};

export const eventTrainingPaymentRegistration = async () => {
  try {
    const res = await privateRequest.get(
      `/payments/event-training-registration`
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
  form.append("type", data.type);
  form.append("description", data.description);
  form.append("image", data.image[0]);

  const res = await privateRequest.post("/services/all-services", form);
  return res.data;
};

export const getServices = async (): Promise<ServiceResponseType[]> => {
  const res = await privateRequest.get("/services/all-services");
  return res.data.data;
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
  form.append("type", data.type);
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
  return res.data;
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

//MPDCLPageContent
type MPDCLPageContent = {
  renewable_items: {
    header: string;
    description: string;
  }[];
  who_we_are: string[];
  our_objectives_header: string;
  renewable_image: string;
  renewable_desc: string[];
  our_objectives_items: string[];
};
export const getMPDCLPageContentApi = async (): Promise<MPDCLPageContent> => {
  const resp = await privateRequest.get(`/structure/mpdcl`);
  return resp.data.data;
};

export const updateMPDCLPageContentApi = async (
  data: MPDCLPageContentSchemaFormType
): Promise<any> => {
  const form = new FormData();
  form.append("renewable_items", JSON.stringify(data.renewable_items));
  if (data.who_we_are) {
    form.append(
      "who_we_are",
      JSON.stringify(data.who_we_are.map((d) => d.value))
    );
  }
  if (data.our_objectives_header) {
    form.append("our_objectives_header", data.our_objectives_header);
  }
  form.append(
    "our_objectives_items",
    JSON.stringify(data.our_objectives_items?.map((d) => d.value))
  );
  form.append(
    "renewable_desc",
    JSON.stringify(data.renewable_desc?.map((d) => d.value))
  );
  if (typeof data.renewable_image != "string") {
    form.append("renewable_image", data.renewable_image[0]);
  }
  const resp = await privateRequest.put(`/structure/mpdcl`, form);
  return resp.data;
};

type MrcPageResponse = {
  objectives_card: {
    header: string;
    description: string;
  }[];
  who_we_are: string[];
  objectives: string[];
};
export const getMrcPage = async (): Promise<MrcPageResponse> => {
  const resp = await privateRequest.get(`structure/mrc`);
  return resp.data.data;
};

export const updateMrcPageApi = async (data: MrcPageContentTabschemaType) => {
  const newData = {
    objectives_card: data.objectives_card,
    who_we_are: data.who_we_are?.map((d) => d.value),
    objectives: data.objectives?.map((d) => d.value),
  };

  const resp = await privateRequest.put("structure/mrc", newData);
  return resp.data;
};

type getSectoralGroupApiResponseType = {
  id?: number;
  image: any;
  header: string;
};
export const getSectoralGroupApi = async (): Promise<
  getSectoralGroupApiResponseType[]
> => {
  const resp = await privateRequest.get("structure/sectoral-group");
  return resp.data.data;
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
  extra_title1?: string;
  extra_title2?: string;
  type: string;
  created_at?: string;
  updated_at?: string;
};
export const getExecutiveApi = async (): Promise<ExecutiveType[]> => {
  const resp = await privateRequest.get("aboutus/our-executives");
  return resp.data.data;
};

export const createExecutiveApi = async (data: ExecutiveType): Promise<any> => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("title", data.title);
  form.append("type", data.type);
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
};

export const updateExecutiveApi = async (data: ExecutiveType): Promise<any> => {
  const form = new FormData();
  form.append("name", data.name);
  form.append("title", data.title);
  form.append("type", data.type);
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
}: {
  application_status?: "approval_in_progress" | "final_approval";
}): Promise<ProspectiveMembertype[]> => {
  const resp = await rel8Request.get(
    `prospectivemember/admin_manage_prospective_member/get_submissions/?application_status=${application_status}`
  );
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
  vision_intro: string[];
  mission_intro: string[];
  advocacy_intro: string[];
  history_intro: string[];
  why_join_intro: string[];
  members_intro: string[];
  slider_image1: string | null;
  slider_image2: string | null;
  slider_image3: string | null;
};
export const getHomePageContent =
  async (): Promise<HomePageContentServerResponse> => {
    const resp = await privateRequest.get(`membership/home-main/`);
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
  form.append("slider_welcome_message", data.slider_welcome_message);
  form.append("slider_vision_message", data.slider_vision_message);
  form.append("slider_mission_message", data.slider_mission_message);

  form.append(
    "vision_intro",
    JSON.stringify(data.vision_intro?.map((d) => d.value))
  );
  form.append(
    "mission_intro",
    JSON.stringify(data.mission_intro?.map((d) => d.value))
  );
  form.append(
    "advocacy_intro",
    JSON.stringify(data.advocacy_intro?.map((d) => d.value))
  );
  form.append(
    "history_intro",
    JSON.stringify(data.history_intro?.map((d) => d.value))
  );
  form.append(
    "why_join_intro",
    JSON.stringify(data.why_join_intro?.map((d) => d.value))
  );
  form.append(
    "members_intro",
    JSON.stringify(data.members_intro?.map((d) => d.value))
  );

  const resp = await privateRequest.put(`membership/home-main/`, form);
  return resp.data.data;
};
