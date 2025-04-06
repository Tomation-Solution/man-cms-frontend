import React, { useState } from "react";
import { ContactMainContainer } from "../Modals/Modals.styles";
import { FormError, Header } from "../../globals/styles/forms.styles";
import { useMutation, useQuery } from "react-query";
import {
  downloadPublicationPayments,
  publicationPayments,
} from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import PublicationPaymentItem, {
  PublicationsPaymentType,
} from "./PaymentsItems/PublicationPaymentItem";
import Pagination from "./Pagination";
import FilterModal from "../Modals/payment/FilterModal";
import { FiFilter } from "react-icons/fi";
import DownloadModal from "../Modals/payment/DownloadModal";

const PAGE_SIZE = 10;

const PublicationPayments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [filters, setFilters] = useState({});

  // Fetch data based on the current page and filters
  const { isLoading, isFetching, isError, data } = useQuery(
    ["all-payments-publication", currentPage, filters],
    () =>
      publicationPayments({
        ...filters,
        page: currentPage,
        page_size: PAGE_SIZE,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: download, isLoading: isDownloading } = useMutation({
    mutationFn: downloadPublicationPayments,
    onSuccess: () => setIsDownloadOpen(false),
  });

  // Handle applying filters and resetting to the first page
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page when filters change
    setIsFilterOpen(false);
  };

  return (
    <ContactMainContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Header>Publication Payments</Header>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginLeft: "auto",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2b3513",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => setIsFilterOpen(true)}
          >
            <FiFilter style={{ marginRight: "6px" }} /> Filter
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2b3513",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={() => setIsDownloadOpen(true)}
          >
            Download
          </button>
        </div>
      </div>

      <Loading loading={isLoading || isFetching} />
      {!isError && data ? (
        <>
          {data.results?.map((item: PublicationsPaymentType, index: number) => (
            <PublicationPaymentItem data={item} key={index} />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data.count / PAGE_SIZE)} // Use the total count from the response
            onPageChange={(page) => setCurrentPage(page)} // Change page when the user navigates
          />
        </>
      ) : (
        <FormError>Can't Fetch Publication Payments</FormError>
      )}

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        onApply={(settings: any) => {
          download(settings);
        }}
      />
    </ContactMainContainer>
  );
};

export default PublicationPayments;

// import React from "react";
// import { ContactMainContainer } from "../Modals/Modals.styles";
// import { FormError, Header } from "../../globals/styles/forms.styles";
// import { useQuery } from "react-query";
// import { publicationPayments } from "../../axios/api-calls";
// import Loading from "../Loading/Loading";
// import PublicationPaymentItem, {
//   PublicationsPaymentType,
// } from "./PaymentsItems/PublicationPaymentItem";

// const PublicationPayments = () => {
//   const { isLoading, isFetching, isError, data } = useQuery(
//     "all-payments-publication",
//     publicationPayments,
//     {
//       refetchOnWindowFocus: false,
//       select: (data) => data.data,
//     }
//   );

//   return (
//     <>
//       <ContactMainContainer>
//         <Loading loading={isLoading || isFetching} />
//         {!isError && data ? (
//           <>
//             {data.map((item: PublicationsPaymentType, index: number) => (
//               <PublicationPaymentItem data={item} key={index} />
//             ))}
//           </>
//         ) : (
//           <FormError>Can't Fetch Publication Payments</FormError>
//         )}
//       </ContactMainContainer>
//     </>
//   );
// };

// export default PublicationPayments;
