import { useMutation, useQueryClient } from "react-query";
import { deleteAgmFaq } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Loading from "../../Loading/Loading";
import Button from "../../Button/Button";

type Props = {
  itemId: any;
  closefn: () => void;
};

function DeleteAGMFaq({ itemId, closefn }: Props) {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(() => deleteAgmFaq(itemId), {
    onSuccess: () => {
      queryClient.invalidateQueries("all-agm-faqs");
      toast.success("deleted successfully");
      closefn();
    },
    onError: () => {
      toast.error("failed to delete");
    },
  });

  return (
    <>
      <Loading loading={isLoading} />
      <h1>Are you sure you want to delete this item</h1>
      <Button styleType="whiteBg" onClick={() => mutate()}>
        Delete
      </Button>
    </>
  );
}

export default DeleteAGMFaq;
