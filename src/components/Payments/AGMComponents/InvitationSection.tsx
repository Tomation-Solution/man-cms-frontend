import React, { useState } from "react";
import { useQuery } from "react-query";
import { getAllInvitations } from "../../../axios/api-calls";
import { ContactMainContainer } from "../../Modals/Modals.styles";
import Loading from "../../Loading/Loading";
import InvitationItem, {
  InvitationItemType,
} from "../PaymentsItems/InvitationItem";
import { FormError } from "../../../globals/styles/forms.styles";
import { PublicationsHeadBanner } from "../../Publications/Publications.styles";
import Button from "../../Button/Button";
import SendInvitationModal from "./Modals/SendInvitationModal";

const InvitationSection = () => {
  const [sendInviteModal, setSendInviteModal] = useState(false);

  const { isLoading, isError, data, isFetching } = useQuery(
    "all-invitations",
    getAllInvitations,
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    }
  );

  return (
    <>
      {sendInviteModal && (
        <SendInvitationModal
          closefn={() => setSendInviteModal(!sendInviteModal)}
        />
      )}
      <PublicationsHeadBanner>
        <Button
          styleType="sec"
          style={{ marginTop: "20px" }}
          onClick={() => setSendInviteModal(!sendInviteModal)}
        >
          Send Invitation
        </Button>
      </PublicationsHeadBanner>
      <ContactMainContainer>
        <Loading loading={isLoading || isFetching} />
        {!isError && data ? (
          <>
            {data.map((item: InvitationItemType, index: number) => (
              <InvitationItem data={item} key={index} />
            ))}
          </>
        ) : (
          <FormError>Can't Fetch Invitations</FormError>
        )}
      </ContactMainContainer>
    </>
  );
};

export default InvitationSection;
