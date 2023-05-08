import React from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import { useMutation, useQueryClient } from "react-query";
import { publicationTypesRename } from "../../../axios/api-calls";
import { useForm } from "react-hook-form";
import BackDrop from "../../BackDrop/BackDrop";
import Loading from "../../Loading/Loading";
import { toast } from "react-toastify";
import { EditPublicationContainer } from "./PublicationModals.styles";

const RenamePublication: React.FC<{
  closefn: () => void;
  typeId: number;
  typedName: string;
}> = ({ closefn, typeId, typedName }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isLoading } = useMutation(publicationTypesRename, {
    onMutate: () => {
      toast.info("publication type renaming", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("publication type renamed", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-publication-types");
      closefn();
    },
    onError: () => {
      toast.error("publication type not renamed", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: any) => {
    mutate({ id: typeId, ...data });
    console.log({ id: typeId, ...data });
  };
  return (
    <BackDrop>
      <EditPublicationContainer>
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <ModalsContainer>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Rename Publication</h2>
              <br />
              <h4>Current Name</h4>
              <p>{typedName}</p>

              <FormError>{errors?.name ? "invalid input" : null}</FormError>
              <FormInput>
                <label>
                  Name
                  <br />
                  <input
                    type="text"
                    {...register("name", { required: true })}
                  />
                </label>
              </FormInput>

              <div>
                <CustomModalButton>SAVE</CustomModalButton>
                <CustomModalButton clickfn={closefn}>CLOSE</CustomModalButton>
              </div>
            </Form>
          </ModalsContainer>
        )}
      </EditPublicationContainer>
    </BackDrop>
  );
};

export default RenamePublication;
