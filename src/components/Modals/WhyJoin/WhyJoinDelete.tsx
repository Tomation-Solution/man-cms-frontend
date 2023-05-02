import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { whyJoinDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import { ModalsContainer } from "../Modals.styles";
import Loading from "../../Loading/Loading";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";

const WhyJoinDelete: React.FC<{ whyId: number; closefn: () => void }> = ({
  closefn,
  whyId,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id: number) => whyJoinDelete(id), {
    onMutate: () => {
      toast.info("why join man item deleting...", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
    onSuccess: () => {
      toast.success("why join man item deleted", {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries("all-why-join");
      closefn();
    },
    onError: () => {
      toast.error("why join man item not deleted", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const deleteHandler = () => {
    mutate(whyId);
  };

  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} light />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE WHY WE JOIN ITEM WITH THE ID OF{" "}
            {whyId}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default WhyJoinDelete;
