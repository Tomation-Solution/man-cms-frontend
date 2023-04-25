import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { reportsDelete } from "../../../axios/api-calls";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { ModalsContainer } from "../Modals.styles";
import Loading from "../../Loading/Loading";

const DeleteReportsModal: React.FC<{
  reportId: number;
  closefn: () => void;
}> = ({ reportId, closefn }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id: number) => reportsDelete(id), {
    onMutate: () => {
      toast.info("reports deleting...", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
    onSuccess: () => {
      toast.success("reports deleted", {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries("all-reports");
      closefn();
    },
    onError: () => {
      toast.error("reports not deleted", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const deleteHandler = () => {
    mutate(reportId);
  };

  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE REPORT WITH THE ID OF {reportId}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default DeleteReportsModal;
