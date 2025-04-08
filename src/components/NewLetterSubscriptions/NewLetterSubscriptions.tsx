import React, { useState } from "react";
import { useQuery } from "react-query";
import { newLetterGetAll } from "../../axios/api-calls";
import { NewLetterSubscriptionsType } from "./NewLetterSubscriptionsItems";
import EditNewsletterUIModal from "./EditNewsLeterUI";
import { ContactMainContainer } from "../Modals/Modals.styles";
import { FormError, Header } from "../../globals/styles/forms.styles";
import Loading from "../Loading/Loading";
import Pagination from "../Payments/Pagination";

const PAGE_SIZE = 10;

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

const rowStyles: React.CSSProperties = {
  backgroundColor: "#f9f9f9",
};

const NewLetterSubscriptions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setEditModal] = useState(false);

  const { isLoading, isFetching, isError, data } = useQuery(
    ["newsletter-subscriptions", currentPage],
    () =>
      newLetterGetAll({
        page: currentPage,
        page_size: PAGE_SIZE,
      }),
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(data);

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
          <h1 style={{ color: "#2b3513" }}>Newsletter Subscriptions</h1>
        </Header>
        <button
          onClick={() => setEditModal(true)}
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
          Edit Newsletter UI
        </button>
      </div>

      {showEditModal && (
        <EditNewsletterUIModal closefn={() => setEditModal(false)} />
      )}

      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />

        {!isError && data ? (
          <>
            <table style={tableStyles}>
              <thead>
                <tr>
                  <th style={thStyles}>Name</th>
                  <th style={thStyles}>Email</th>
                  <th style={thStyles}>Subscription Ref</th>
                  <th style={thStyles}>Date Subscribed</th>
                  <th style={thStyles}>Verified</th>
                </tr>
              </thead>
              <tbody>
                {data.results.map(
                  (item: NewLetterSubscriptionsType, index: number) => (
                    <tr key={item.id} style={index % 2 === 0 ? {} : rowStyles}>
                      <td style={tdStyles}>{item.name}</td>
                      <td style={tdStyles}>{item.email}</td>
                      <td style={tdStyles}>{item.ref}</td>
                      <td style={tdStyles}>
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td style={tdStyles}>
                        {item.is_verified ? "✅ Yes" : "❌ No"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(data.count / PAGE_SIZE)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <FormError>Can't Fetch Newsletter Subscriptions</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default NewLetterSubscriptions;
