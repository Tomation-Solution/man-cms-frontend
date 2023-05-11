import React from "react";
import { ContactMainContainer } from "../Modals/Modals.styles";
import { FormError, Header } from "../../globals/styles/forms.styles";
import { useQuery } from "react-query";
import { publicationPayments } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import PublicationPaymentItem, {
  PublicationsPaymentType,
} from "./PaymentsItems/PublicationPaymentItem";

const PublicationPayments = () => {
  const { isLoading, isFetching, isError, data } = useQuery(
    "all-payments-publication",
    publicationPayments,
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    }
  );

  return (
    <>
      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: PublicationsPaymentType, index: number) => (
              <PublicationPaymentItem data={item} key={index} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch Publication Payments</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default PublicationPayments;
