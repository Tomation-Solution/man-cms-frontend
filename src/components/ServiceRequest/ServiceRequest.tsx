import React, { useState } from "react";
import { ContactMainContainer } from "../Modals/Modals.styles";
import { useQuery } from "react-query";
import {
  serviceRequestDownload,
  serviceRequestGetAll,
} from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import ServiceRequestItem, { ServiceRequestType } from "./ServiceRequestItem";
import { Header } from "../../globals/styles/forms.styles";
import Pagination from "../Payments/Pagination";
import DownloadModal from "./DownloadModal";

const ServiceRequest = () => {
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const [pageSize, setPageSize] = useState(10); // State for page size (optional)
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [filters, setFilters] = useState<any>({}); // Store the applied filters

  // Function to handle applying filters
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters); // Set the filters when apply is clicked
  };

  // Pagination query for fetching paginated data
  const { isLoading, isFetching, isError, data } = useQuery(
    ["all-service-request", currentPage, pageSize], // Pagination only, independent of filters
    () =>
      serviceRequestGetAll({
        page: currentPage,
        page_size: pageSize,
        is_verified: "true",
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Filter query for downloading filtered data (this runs independently)
  const { data: filteredData } = useQuery(
    ["filtered-service-request", filters], // Filters only, independent of pagination
    () =>
      serviceRequestDownload({
        ...filters, // Apply filters but not pagination params
      }),
    {
      refetchOnWindowFocus: false,
      // enabled: Object.keys(filters).length > 0, // Only run when filters are applied
    }
  );

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle opening and closing the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h1>Service Requests</h1>
          <button
            onClick={handleOpenModal}
            style={{
              padding: "10px",
              backgroundColor: "#2b3513",
              color: "#fff",
            }}
          >
            Open Download Modal
          </button>
        </div>
      </Header>
      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.results.map((item: ServiceRequestType) => (
              <ServiceRequestItem data={item} key={item.id} />
            ))}

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(data.count / pageSize)} // Calculate total pages based on count and pageSize
              onPageChange={handlePageChange} // Handle page change
            />
            <DownloadModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onApply={handleApplyFilters}
            />
          </>
        ) : (
          <FormError>Can't Fetch Service Requirements</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default ServiceRequest;
