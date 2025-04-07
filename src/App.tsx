import { ToastContainer } from "react-toastify";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import NotFound from "./components/NotFound/NotFound";
import PublicationsPage from "./pages/PublicationsPage";
import LoginPage from "./pages/LoginPage";
import "react-toastify/dist/ReactToastify.css";
import NewsPage from "./pages/NewsPage";
import ReportsPage from "./pages/ReportsPage";
import EventsPage from "./pages/EventsPage";
import TrainingsPage from "./pages/TrainingsPage";
import AboutUsPage from "./pages/AboutUsPage";
import MembershipPage from "./pages/MembershipPage";
import ProspectiveMembers from "./components/ProspectiveMembers/ProspectiveMembers";
import ProspectiveMembersForm from "./components/ProspectiveMembers/ProspectiveMembersFormOne";
import ProspectiveMembersFormTwo from "./components/ProspectiveMembers/ProspectiveMembersFormTwo";
import ApprovalMessage from "./components/ProspectiveMembers/ApprovalMessage";
import CertificateIssuing from "./components/ProspectiveMembers/CertificateIssuing/CertificateIssuing";
import CertificateAppointment from "./components/ProspectiveMembers/CertificateIssuing/CertificateAppointment";
import GalleryPage from "./pages/GalleryPage";
import ServiceRequestPages from "./pages/ServiceRequestPages";
import NewsLetterPage from "./pages/NewsLetterPage";
import ServicePage from "./pages/ServicePage/ServicePage";
import StructurePage from "./pages/Structure/StructurePage";
import PaymentsPage from "./pages/PaymentsPage";
import HomePageManagement from "./pages/HomePageManagement/NewHomePageManagement";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import ExecutiveMemberViewPage from "./components/ProspectiveMembers/ExecutiveMember";
import AGMSectionPage from "./pages/AGMSectionPage";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/service-request" element={<ServiceRequestPages />} />
            <Route path="/newsletter-sub" element={<NewsLetterPage />} />
            <Route path="/service" element={<ServicePage />} />
            <Route path="/structure" element={<StructurePage />} />
            <Route
              path="/payments-and-registrations"
              element={<PaymentsPage />}
            />

            <Route
              path="/prospective-members"
              element={<ProspectiveMembers />}
            />
            <Route path="/" element={<HomePageManagement />} />

            <Route
              path="/prospective-members/details/:id"
              element={<ProspectiveMembersForm />}
            />
            <Route
              path="/prospective-members/form-two"
              element={<ProspectiveMembersFormTwo />}
            />
            <Route
              path="/certificate-issuing"
              element={<CertificateIssuing />}
            />
            <Route
              path="/certificate-appointment"
              element={<CertificateAppointment />}
            />
            <Route
              path="/prospective-members-executive"
              element={<ExecutiveMemberViewPage />}
            />

            <Route path="/agm-section" element={<AGMSectionPage />} />

            <Route
              path="/approval-message"
              element={
                <ApprovalMessage
                  header="Application Approved"
                  message="Proceed to set date for certificate collection."
                  btncontent="Go Home"
                />
              }
            />
            <Route
              path="/certificate-message"
              element={
                <ApprovalMessage
                  header="Certificate pick Up Date Set"
                  message="The Applicant will be notified about their certificate pick up date. "
                  btncontent="Go Home"
                />
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
