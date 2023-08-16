import { useMutation, useQueryClient } from "react-query";
import Button from "../../Button/Button";
import Loading from "../../Loading/Loading";
import { toast } from "react-toastify";
import { deleteAdvert } from "../../../axios/api-calls";

type Props = {
  itemId: any;
  closefn: () => void;
};

function DeleteAdvertModals({ itemId, closefn }: Props) {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(() => deleteAdvert(itemId), {
    onSuccess: () => {
      queryClient.invalidateQueries("all-adverts");
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

export default DeleteAdvertModals;
