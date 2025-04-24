import React from "react";
import { ModalsContainer } from "../Modals.styles";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import Loading from "../../Loading/Loading";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  eventsPartialUpdate,
  getCurrentAgmEvent,
} from "../../../axios/api-calls";
import { toast } from "react-toastify";

const SetCurrentAGMModal: React.FC<{
  eventId: number;
  closefn: () => void;
  eventName: string;
}> = ({ eventId, closefn, eventName }) => {
  const queryClient = useQueryClient();
  const currentAGMEvent = useQuery("current-agm-event", getCurrentAgmEvent, {
    select(data) {
      return data?.results?.[0];
    },
  });

  console.log({ currentAGMEvent, eventId, eventName });

  const { mutate, isLoading } = useMutation(
    (payload: any) => eventsPartialUpdate(payload),
    {
      onMutate: () => {
        toast.info("event being set as current...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("events set as current", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-events");
        closefn();
      },
      onError: () => {
        toast.error("events not set as current", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const setCurrentHandler = () => {
    const formData = new FormData();
    formData.append("is_current_agm", "true");
    mutate({ eventsId: eventId, FormDataHandler: formData });

    setTimeout(() => {
      window.location.href = "/agm-section";
    }, 1500);
  };

  return (
    <ModalsContainer>
      {isLoading || currentAGMEvent.isLoading ? (
        <Loading loading={isLoading} />
      ) : currentAGMEvent.data?.id === eventId ? (
        <>
          <Header>Current AGM</Header>
          <p>This event is already set as the current AGM.</p>
        </>
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO SET THIS EVENT WITH THE NAME "{eventName}"
            AS THE CURRENT AGM?
            <br />
            <br />
            <small>
              This means any other previously set Current AGM will be removed
              from the position of current AGM, as there can only be one Current
              AGM at a time.
            </small>
          </Header>
          <CustomModalButton clickfn={setCurrentHandler}>
            SET AS CURRENT AGM
          </CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default SetCurrentAGMModal;
