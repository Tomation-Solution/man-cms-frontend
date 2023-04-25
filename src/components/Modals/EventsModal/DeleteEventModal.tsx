import React from "react";
import { ModalsContainer } from "../Modals.styles";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import Loading from "../../Loading/Loading";
import { useMutation, useQueryClient } from "react-query";
import { eventsDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";

const DeleteEventModal: React.FC<{
  eventId: number;
  closefn: () => void;
}> = ({ eventId, closefn }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id: number) => eventsDelete(id), {
    onMutate: () => {
      toast.info("events deleting...", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
    onSuccess: () => {
      toast.success("events deleted", {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries("all-events");
      closefn();
    },
    onError: () => {
      toast.error("events not deleted", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const deleteHandler = () => {
    mutate(eventId);
  };
  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE EVENT WITH THE ID OF {eventId}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default DeleteEventModal;
