import React from "react";
import { useQuery } from "react-query";
import { agmMembershipRegistration } from "../../../axios/api-calls";
import { ContactMainContainer } from "../../Modals/Modals.styles";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import MembersRegistrationItem, {
  MembersRegistrationItemType,
} from "../PaymentsItems/MembersRegistrationItem";

const MembersSection = () => {
  const { isLoading, isError, isFetching, data } = useQuery(
    "all-agm-member",
    agmMembershipRegistration,
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
          {data.map((item: MembersRegistrationItemType, index: number) => (
            <MembersRegistrationItem data={item} key={index} />
          ))}
        </>
      ) : (
        <FormError>Can't Fetch Members Registration</FormError>
      )}
    </ContactMainContainer>
  );
};

export default MembersSection;
