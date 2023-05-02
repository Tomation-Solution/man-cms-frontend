import React from "react";
import { faqDelete } from "../../../axios/api-calls";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { ModalsContainer } from "../Modals.styles";
import Loading from "../../Loading/Loading";
import { Header } from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";

const FAQSDelete: React.FC<{ joinId: number; closefn: () => void }> = ({
  closefn,
  joinId,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation((id: number) => faqDelete(id), {
    onMutate: () => {
      toast.info("FAQ item deleting...", {
        progressClassName: "toastProgress",
        icon: false,
      });
    },
    onSuccess: () => {
      toast.success("FAQ item deleted", {
        progressClassName: "toastProgress",
        icon: false,
      });
      queryClient.invalidateQueries("all-faqs");
      closefn();
    },
    onError: () => {
      toast.error("FAQ item not deleted", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

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
            ARE YOU SURE YOU WANT TO DELETE FAQ ITEM WITH THE ID OF {joinId}
          </Header>
          <CustomModalButton clickfn={deleteHandler}>DELETE</CustomModalButton>
        </>
      )}
    </ModalsContainer>
  );
};

export default FAQSDelete;
