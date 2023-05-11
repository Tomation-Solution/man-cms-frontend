import React from "react";
import { useQuery } from "react-query";
import { agmPaymentRegistration } from "../../axios/api-calls";
import { ContactMainContainer } from "../Modals/Modals.styles";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import AGMPaymentItem, { AGMPaymentType } from "./PaymentsItems/AGMPaymentItem";

const AGMPayments = () => {
  const { isLoading, isFetching, isError, data } = useQuery(
    "all-agm-registrations",
    agmPaymentRegistration,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: AGMPaymentType, index: number) => (
              <AGMPaymentItem data={item} key={index} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch AGM Registration Data</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default AGMPayments;
