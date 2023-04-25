import React from "react";
import { ModalsContainer } from "../Modals.styles";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import Loading from "../../Loading/Loading";
import { useMutation, useQueryClient } from "react-query";
import { trainingsDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";

const DeleteTrainingsModal: React.FC<{
  trainingsId: number;
  closefn: () => void;
}> = ({ trainingsId, closefn }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (id: number) => trainingsDelete(id),
    {
      onMutate: () => {
        toast.info("trainings deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("trainings deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-trainings");
        closefn();
      },
      onError: () => {
        toast.error("trainings not deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const deleteHandler = () => {
    mutate(trainingsId);
  };

  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE TRAININGS WITH THE ID OF{" "}
            {trainingsId}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default DeleteTrainingsModal;
