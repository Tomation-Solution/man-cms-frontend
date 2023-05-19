import React, { useState } from "react";
import {
  agmOtherRegistration,
  getAllQuickRegistrations,
} from "../../../axios/api-calls";
import { useQuery } from "react-query";
import { ContactMainContainer } from "../../Modals/Modals.styles";
import Loading from "../../Loading/Loading";
import OthersItem, { OtherItemType } from "../PaymentsItems/OthersItem";
import { FormError, Header } from "../../../globals/styles/forms.styles";
import Button from "../../Button/Button";
import MakeQuickRegistration from "./Modals/MakeQuickRegistration";
import MakeQuickItem, {
  MakeQuickItemType,
} from "../PaymentsItems/MakeQuickItem";

const OthersSection = () => {
  const [quickRegistrationModal, setQuickRegistrationModal] = useState(false);

  const { isLoading, isError, isFetching, data } = useQuery(
    "all-agm-others",
    agmOtherRegistration,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  const quickQueryResult = useQuery(
    "all-quick-registrations",
    getAllQuickRegistrations,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      {quickRegistrationModal && (
        <MakeQuickRegistration
          closefn={() => setQuickRegistrationModal(!quickRegistrationModal)}
        />
      )}

      <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          styleType={"sec"}
          onClick={() => setQuickRegistrationModal(!quickRegistrationModal)}
        >
          Make Quick Registration
        </Button>
      </div>

      <ContactMainContainer>
        <Header>
          <h1>Quick Registrations</h1>
        </Header>
        <Loading
          loading={quickQueryResult.isLoading || quickQueryResult.isFetching}
        />
        {!quickQueryResult.isError && quickQueryResult.data ? (
          <>
            {quickQueryResult.data.map(
              (item: MakeQuickItemType, index: number) => (
                <MakeQuickItem data={item} key={index} />
              )
            )}
          </>
        ) : (
          <FormError>Can't Fetch Quick Registrations</FormError>
        )}
      </ContactMainContainer>
      <br />
      <ContactMainContainer>
        <Header>
          <h1>Media, Guests, Staff, Exhibition Participant Registrations</h1>
        </Header>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: OtherItemType, index: number) => (
              <OthersItem data={item} key={index} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch Others Registrations</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default OthersSection;
