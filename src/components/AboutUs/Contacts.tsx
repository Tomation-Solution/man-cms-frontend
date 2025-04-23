import SeeDetails from "../Modals/ContactModals/SeeDetails";
import { useQuery } from "react-query";
import { contactGetAll, contactGetDownload } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import { ContactMainContainer } from "../Modals/Modals.styles";
import { useState } from "react";
import Pagination from "../Payments/Pagination";
import DownloadModal from "../ServiceRequest/DownloadModal";

export interface DataType {
  id: number;
  name: string;
  phone_no: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const Contacts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const [filters, setFilters] = useState<any>({}); // Store the applied filters

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["all-contacts", currentPage],
    queryFn: () => contactGetAll({ page: currentPage }),
    keepPreviousData: true,
  });

  // Filter query for downloading filtered data (this runs independently)
  const { data: filteredData } = useQuery(
    ["filtered-service-request", filters], // Filters only, independent of pagination
    () =>
      contactGetDownload({
        ...filters, // Apply filters but not pagination params
      }),
    {
      refetchOnWindowFocus: false,
      // enabled: Object.keys(filters).length > 0, // Only run when filters are applied
    }
  );

  // Function to handle applying filters
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters); // Set the filters when apply is clicked
  };

  // Handle opening and closing the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // const { isLoading, isFetching, data, isError } = useQuery(
  //   "all-contacts",
  //   contactGetAll,
  //   { select: (data) => data.data, refetchOnWindowFocus: false }
  // );

  return (
    <div>
      <ContactMainContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
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
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.results?.map((item: DataType) => (
              <SeeDetails data={item} key={item.id} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch Contacts</FormError>
        )}
        {data && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data.count / 10)} // Assuming 10 items per page
            onPageChange={setCurrentPage}
          />
        )}
        <DownloadModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onApply={handleApplyFilters}
        />
        ;
      </ContactMainContainer>
    </div>
  );
};

export default Contacts;
