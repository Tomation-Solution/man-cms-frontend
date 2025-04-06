import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  downloadEventAndTrainingPayments,
  eventTrainingPaymentRegistration,
} from "../../axios/api-calls";
import { ContactMainContainer } from "../Modals/Modals.styles";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import EventSection from "./TrainingsEventsPaymentComponents/EventSection";
import TrainingSection from "./TrainingsEventsPaymentComponents/TrainingSection";
import Pagination from "./Pagination";
import FilterModal from "../Modals/payment/FilterModal";
import { FiFilter } from "react-icons/fi";
import DownloadModal from "../Modals/payment/DownloadModal";

const TrainingsEventsPayments = () => {
  const [options, setOptions] = useState("event");
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const { isLoading, isError, isFetching, data, isPreviousData } = useQuery(
    ["all-events-registrations", currentPage, options, filters],
    () => eventTrainingPaymentRegistration(currentPage, options, filters),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const { mutate: download, isLoading: isDownloading } = useMutation({
    mutationFn: downloadEventAndTrainingPayments,
    onSuccess: () => setDownloadModalOpen(false),
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(data?.count / 10)) return;
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(data?.count / 10);

  return (
    <>
      <div
        style={{
          padding: "10px 5px",
          display: "flex",
          gap: "10px",
          overflowX: "auto",
        }}
      >
        <span
          style={{
            fontWeight: "500",
            color: `${options === "event" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("event")}
        >
          events
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "mrc-training" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("mrc-training")}
        >
          mrc training
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "mpdcl-training" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("mpdcl-training")}
        >
          mpdcl training
        </span>

        <span
          style={{
            fontWeight: "500",
            color: `${options === "other-training" ? "#4FDE9D" : "#2b3513"}`,
            cursor: "pointer",
            borderRight: "1px solid #2b3513",
            flex: "0 0 200px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOptions("other-training")}
        >
          other training
        </span>

        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            width: "100%",
          }}
        >
          <button
            onClick={() => setFilterModalOpen(true)}
            style={{
              marginLeft: "auto",
              padding: "8px 12px",
              backgroundColor: "#2b3513",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            <FiFilter style={{ marginRight: "6px" }} /> Filter
          </button>
          <button
            onClick={() => setDownloadModalOpen(true)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#2b3513",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Download
          </button>
        </div>
      </div>

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(appliedFilters: any) => {
          setFilters(appliedFilters);
          setCurrentPage(1);
        }}
      />

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        onApply={(appliedFilters: any) => {
          download({ ...appliedFilters, options });
        }}
      />

      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />

        {!isError && data ? (
          <>
            {options === "event" && <EventSection data={data?.results} />}

            {options !== "event" && (
              <TrainingSection
                data={data?.results}
                trainingTypeFilter={"others"}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <FormError>
            Can't Fetch Trainings & Events Registrations Data
          </FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default TrainingsEventsPayments;
