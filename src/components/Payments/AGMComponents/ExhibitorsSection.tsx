import React from "react";
import { agmExhibitorRegistration } from "../../../axios/api-calls";
import { useQuery } from "react-query";
import { ContactMainContainer } from "../../Modals/Modals.styles";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import ExhibitorsItem, {
  ExhibitorItemType,
} from "../PaymentsItems/ExhibitorsItem";

const ExhibitorsSection = () => {
  const { isLoading, isError, isFetching, data } = useQuery(
    "all-agm-exhibitor",
    agmExhibitorRegistration,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ContactMainContainer>
      <Loading loading={isLoading || isFetching} />
      {!isError && data ? (
        <>
          {data.map((item: ExhibitorItemType, index: number) => (
            <ExhibitorsItem data={item} key={index} />
          ))}
        </>
      ) : (
        <FormError>Can't Fetch Exhibitors Registration</FormError>
      )}
    </ContactMainContainer>
  );
};

export default ExhibitorsSection;
