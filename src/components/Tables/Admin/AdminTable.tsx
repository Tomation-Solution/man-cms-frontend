import React, { useState } from "react";
import { TableReject, TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import Tables from "../Tables";
import { useQuery } from "react-query";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import Pagination from "../../Payments/Pagination";
import CreateAdminModal from "../../Modals/AdminModals/CreateAdminModal";
import { useMutation, useQueryClient } from "react-query";
import privateRequest from "../../../axios/axios-utils";

// Interface for Admin user data
interface AdminUser {
  id: number;
  email: string;
  user_type: string;
  createdAt: string;
  lastLogin?: string;
}

// Interface for API response
interface AdminsResponse {
  count: number;
  results: AdminUser[];
}

// Function to get all admins
const getAllAdmins = async ({
  page,
  page_size,
}: {
  page: number;
  page_size: number;
}) => {
  try {
    const response = await privateRequest.get(
      `/auth/admins/?page=${page}&page_size=${page_size}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch admins");
  }
};

// Function to delete admin
const deleteAdmin = async (id: number) => {
  try {
    const response = await privateRequest.delete(`/auth/admin/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete admin");
  }
};

const DeleteAdminModal: React.FC<{ adminId: number; closefn: () => void }> = ({
  adminId,
  closefn,
}) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(() => deleteAdmin(adminId), {
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      closefn();
      queryClient.invalidateQueries("admins");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete admin");
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Delete Admin</h2>
      <p>Are you sure you want to delete this admin?</p>
      <p>This action cannot be undone.</p>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={closefn}
          style={{
            padding: "10px 20px",
            background: "#ccc",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => mutate()}
          disabled={isLoading}
          style={{
            padding: "10px 20px",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

const AdminTable: React.FC = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [delId, setDelId] = useState(0);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const closeCreateSlider = () => setIsCreateOpen(!isCreateOpen);
  const closeDeleteSlider = () => setIsDeleteOpen(!isDeleteOpen);

  // User type mapping for display purposes
  const userTypeDisplay = {
    super_user: "Super User",
    event_training: "Event Manager",
    public_view: "Public View",
    publication_news: "Publication News",
    registrations_payments: "Registrations & Payments",
    prospective_certificates: "Prospective Certificates",
    executive_secretary: "Executive Secretary",
  };

  const { isLoading, isError, data, isFetching } = useQuery<AdminsResponse>(
    ["admins", page],
    () => getAllAdmins({ page, page_size: pageSize }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const totalPages = Math.ceil((data?.count || 0) / pageSize);
  const adminResults = data?.results || [];

  const columns = [
    {
      Header: "S/N",
      Cell: (tableProps: any) => {
        return <>{(page - 1) * pageSize + tableProps.row.index + 1}</>;
      },
    },
    { Header: "Email", accessor: "email" },
    {
      Header: "User Type",
      accessor: "user_type",
      Cell: ({ value }: { value: string }) => (
        <span>
          {userTypeDisplay[value as keyof typeof userTypeDisplay] || value}
        </span>
      ),
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      Cell: ({ value }: { value: string }) => (
        <span>{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      Header: "Last Login",
      accessor: "lastLogin",
      Cell: ({ value }: { value: string | undefined }) => (
        <span>{value ? new Date(value).toLocaleDateString() : "Never"}</span>
      ),
    },
  ];

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Delete",
        Header: "Actions",
        Cell: ({ row }: { row: any }) => (
          <TableReject
            onClick={() => {
              setDelId(row.original.id);
              closeDeleteSlider();
            }}
          >
            Delete
          </TableReject>
        ),
      },
    ]);
  };

  return (
    <>
      {/* <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={closeCreateSlider}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create New Admin
        </button>
      </div> */}

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsCreateOpen}
        isOpen={isCreateOpen}
      >
        <CreateAdminModal closefn={closeCreateSlider} />
      </OffCanvas>

      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteAdminModal adminId={delId} closefn={closeDeleteSlider} />
      </OffCanvas>

      {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? (
        <>
          <Tables
            tableColumn={columns}
            tableData={adminResults}
            customHooks={[tableHooks]}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <FormError>Can't Fetch Admins</FormError>
      )}
    </>
  );
};

export default AdminTable;
