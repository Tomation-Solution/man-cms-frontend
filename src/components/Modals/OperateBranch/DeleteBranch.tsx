import React from "react";
import { ModalsContainer } from "../Modals.styles";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { operateBranchDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

const DeleteBranch: React.FC<{ pubid: number; closefn: () => void }> = ({
  pubid,
  closefn,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (id: number) => operateBranchDelete(id),
    {
      onMutate: () => {
        toast.info("operate branch deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("operate branch deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-operate-branch");
        closefn();
      },
      onError: () => {
        toast.error("operate branch not deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const deleteHandler = () => {
    mutate(pubid);
  };
  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} light />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE BRANCH WITH THE ID OF {pubid}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default DeleteBranch;
