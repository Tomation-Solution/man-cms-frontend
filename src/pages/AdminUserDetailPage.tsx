// Example implementation for the Admin User Detail page to include password reset functionality
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import Loading from "../components/Loading/Loading";
import AdminPasswordReset from "../components/Login/AdminResetPassword";
import { getAdminUserById } from "../axios/api-calls";

const AdminUserDetailContainer = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const UserDetailsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

type AdminUserDetailPageProps = {
  resetPassword?: boolean;
};

const AdminUserDetailPage = ({
  resetPassword = false,
}: AdminUserDetailPageProps) => {
  const { id } = useParams();

  // Fetch user details
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery(["admin-user", id], () => getAdminUserById(id || ""), {
    enabled: !!id,
  });

  // Handle successful password reset
  const handleResetComplete = () => {
    // Refetch user data to get updated last_login or other relevant fields
    refetch();
  };

  if (isLoading) return <Loading loading={true} />;

  return (
    <AdminUserDetailContainer>
      <h1>Admin User Details</h1>

      {user && (
        <>
          <UserDetailsCard>
            <h2>{user.email}</h2>
            <p>
              <strong>User Type:</strong> {user.user_type}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(user.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Last Login:</strong>{" "}
              {user.last_login
                ? new Date(user.last_login).toLocaleString()
                : "Never"}
            </p>
            <p>
              <strong>Status:</strong> {user.is_active ? "Active" : "Inactive"}
            </p>
          </UserDetailsCard>

          {/* Show password reset component if specifically requested or on user details page */}
          {(resetPassword || true) && (
            <AdminPasswordReset userId={id} onComplete={handleResetComplete} />
          )}
        </>
      )}

      {!user && (
        <p>User not found or you don't have permission to view this user.</p>
      )}
    </AdminUserDetailContainer>
  );
};

export default AdminUserDetailPage;
