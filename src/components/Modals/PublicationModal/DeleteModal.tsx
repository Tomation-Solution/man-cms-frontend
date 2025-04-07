import React from "react";
import { ModalsContainer } from "../Modals.styles";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { publicationDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";

const DeleteModal: React.FC<{
  publicationName: string;
  pubid: number;
  closefn: () => void;
}> = ({ pubid, publicationName, closefn }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (id: number) => publicationDelete(id),
    {
      onMutate: () => {
        toast.info("publication deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("publication deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-publication");
        closefn();
      },
      onError: () => {
        toast.error("publication not deleted", {
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
        <Loading loading={isLoading} />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE PUBLICATION WITH THE NAME "
            {publicationName}"
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default DeleteModal;
