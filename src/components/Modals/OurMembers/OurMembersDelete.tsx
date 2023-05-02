import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ourMembersDelete } from "../../../axios/api-calls";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { Header } from "../../../globals/styles/forms.styles";
import Loading from "../../Loading/Loading";
import { ModalsContainer } from "../Modals.styles";

const OurMembersDelete: React.FC<{ whyId: number; closefn: () => void }> = ({
  whyId,
  closefn,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (id: number) => ourMembersDelete(id),
    {
      onMutate: () => {
        toast.info("member deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("member deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-members");
        closefn();
      },
      onError: () => {
        toast.error("member not deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

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
            ARE YOU SURE YOU WANT TO DELETE MEMBER WITH THE ID OF {whyId}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default OurMembersDelete;
