import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { joinStepDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import { ModalsContainer } from "../Modals.styles";
import Loading from "../../Loading/Loading";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";

const JoinStepDelete: React.FC<{ joinId: number; closefn: () => void }> = ({
  joinId,
  closefn,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (id: number) => joinStepDelete(id),
    {
      onMutate: () => {
        toast.info("join step item deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("join step item deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-join-step");
        closefn();
      },
      onError: () => {
        toast.error("join step item not deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const deleteHandler = () => {
    mutate(joinId);
  };

  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} light />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE JOIN STEP ITEM WITH THE ID OF{" "}
            {joinId}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default JoinStepDelete;
