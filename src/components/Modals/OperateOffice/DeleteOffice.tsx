import React from "react";
import { ModalsContainer } from "../Modals.styles";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { operateOfficeDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

const DeleteOffice: React.FC<{ pubid: number; closefn: () => void }> = ({
  closefn,
  pubid,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (id: number) => operateOfficeDelete(id),
    {
      onMutate: () => {
        toast.info("operate office deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("operate office deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-operate-office");
        closefn();
      },
      onError: () => {
        toast.error("operate office not deleted", {
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
            ARE YOU SURE YOU WANT TO DELETE OFFICE WITH THE ID OF {pubid}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default DeleteOffice;
