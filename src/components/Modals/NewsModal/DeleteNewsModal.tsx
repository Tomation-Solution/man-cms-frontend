import React from "react";
import { ModalsContainer } from "../Modals.styles";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import Loading from "../../Loading/Loading";
import { useMutation, useQueryClient } from "react-query";
import { newsDelete } from "../../../axios/api-calls";
import { toast } from "react-toastify";

const DeleteNewsModal: React.FC<{
  newsId: number;
  newsName: string;
  closefn: () => void;
}> = ({ newsId, newsName, closefn }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id: number) => newsDelete(id), {
    onMutate: () => {
      toast.info("news deleting...", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
    onSuccess: () => {
      toast.success("news deleted", {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries("all-news");
      closefn();
    },
    onError: () => {
      toast.error("news not deleted", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const deleteHandler = () => {
    mutate(newsId);
  };

  return (
    <ModalsContainer>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <>
          <Header>
            ARE YOU SURE YOU WANT TO DELETE NEWS WITH THE NAME "{newsName}"
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default DeleteNewsModal;
