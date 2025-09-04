import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getFooterContent, updateFooterContent } from "../../axios/api-calls";
import { FormError, Header } from "../../globals/styles/forms.styles";
import Loading from "../Loading/Loading";
import { FooterContentType } from "./types";
import FooterManagementModal from "./FooterManagementModal";

const tableStyles: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const thStyles: React.CSSProperties = {
  backgroundColor: "#2b3513",
  color: "white",
  padding: "12px",
  textAlign: "left",
};

const tdStyles: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  fontSize: "14px",
};

const FooterManagement = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();

  const { isLoading, isError, data } = useQuery(
    ["footer-content"],
    getFooterContent,
    {
      refetchOnWindowFocus: false,
    }
  );

  const updateMutation = useMutation(updateFooterContent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["footer-content"]);
      toast.success("Footer content updated successfully!");
      setShowEditModal(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update footer content"
      );
    },
  });

  const handleUpdate = (footerData: FooterContentType) => {
    updateMutation.mutate(footerData);
  };

  return (
    <>
      <div
        style={{
          padding: "10px 5px",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <Header>
          <h1 style={{ color: "#2b3513" }}>Footer Management</h1>
        </Header>
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            backgroundColor: "#2b3513",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            height: "fit-content",
            display: "flex",
            alignItems: "center",
          }}
        >
          Edit Footer Content
        </button>
      </div>

      {showEditModal && (
        <FooterManagementModal
          footerData={data}
          closefn={() => setShowEditModal(false)}
        />
      )}

      <div style={{ padding: "20px" }}>
        <Loading loading={isLoading} />

        {!isError && data ? (
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>Field</th>
                <th style={thStyles}>Current Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyles}>
                  <strong>Logo</strong>
                </td>
                <td style={tdStyles}>
                  {data.logo ? (
                    <img
                      src={data.logo}
                      alt="Footer Logo"
                      style={{ maxHeight: "50px", maxWidth: "100px" }}
                    />
                  ) : (
                    "No logo set"
                  )}
                </td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Company Name</strong>
                </td>
                <td style={tdStyles}>{data.company_name || "Not set"}</td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Address</strong>
                </td>
                <td style={tdStyles}>{data.address || "Not set"}</td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Email</strong>
                </td>
                <td style={tdStyles}>{data.email || "Not set"}</td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Phone</strong>
                </td>
                <td style={tdStyles}>{data.phone || "Not set"}</td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Webmail URL</strong>
                </td>
                <td style={tdStyles}>
                  {data.webmail_url ? (
                    <a
                      href={data.webmail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.webmail_url}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Branch Network URL</strong>
                </td>
                <td style={tdStyles}>{data.branch_network_url || "Not set"}</td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Services URL</strong>
                </td>
                <td style={tdStyles}>{data.services_url || "Not set"}</td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Facebook URL</strong>
                </td>
                <td style={tdStyles}>
                  {data.facebook_url ? (
                    <a
                      href={data.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.facebook_url}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>LinkedIn URL</strong>
                </td>
                <td style={tdStyles}>
                  {data.linkedin_url ? (
                    <a
                      href={data.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.linkedin_url}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Twitter URL</strong>
                </td>
                <td style={tdStyles}>
                  {data.twitter_url ? (
                    <a
                      href={data.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.twitter_url}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>Instagram URL</strong>
                </td>
                <td style={tdStyles}>
                  {data.instagram_url ? (
                    <a
                      href={data.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.instagram_url}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </td>
              </tr>
              <tr>
                <td style={tdStyles}>
                  <strong>YouTube URL</strong>
                </td>
                <td style={tdStyles}>
                  {data.youtube_url ? (
                    <a
                      href={data.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.youtube_url}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <FormError>Can't Fetch Footer Content</FormError>
        )}
      </div>
    </>
  );
};

export default FooterManagement;
