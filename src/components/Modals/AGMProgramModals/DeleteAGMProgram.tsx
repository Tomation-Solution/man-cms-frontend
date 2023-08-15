import { useMutation, useQueryClient } from "react-query";
import { deleteAgmProgram } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import Button from "../../Button/Button";
import Loading from "../../Loading/Loading";

type Props = {
  itemId: any;
  closefn: () => void;
};

function DeleteAGMProgram({ itemId, closefn }: Props) {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(() => deleteAgmProgram(itemId), {
    onSuccess: () => {
      queryClient.invalidateQueries("all-programs");
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

export default DeleteAGMProgram;
