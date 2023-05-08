import React from "react";
import { ContactMainContainer } from "../Modals/Modals.styles";
import { useQuery } from "react-query";
import { serviceRequestGetAll } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";
import ServiceRequestItem, { ServiceRequestType } from "./ServiceRequestItem";
import { Header } from "../../globals/styles/forms.styles";

const ServiceRequest = () => {
  const { isLoading, isFetching, isError, data } = useQuery(
    "all-service-request",
    serviceRequestGetAll,
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    }
  );
  return (
    <>
      <Header>
        <h1>Service Requests</h1>
      </Header>
      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: ServiceRequestType) => (
              <ServiceRequestItem data={item} key={item.id} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch Service Requirements</FormError>
        )}
      </ContactMainContainer>
      ;
    </>
  );
};

export default ServiceRequest;
