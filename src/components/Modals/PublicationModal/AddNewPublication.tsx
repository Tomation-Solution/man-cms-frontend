import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { publicationTypesCreate } from "../../../axios/api-calls";
import { toast } from "react-toastify";
import { EditPublicationContainer } from "./PublicationModals.styles";
import { ModalsContainer } from "../Modals.styles";
import BackDrop from "../../BackDrop/BackDrop";
import Loading from "../../Loading/Loading";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";

const AddNewPublication: React.FC<{
  closefn: () => void;
}> = ({ closefn }) => {
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

  const { mutate, isLoading } = useMutation(publicationTypesCreate, {
    onMutate: () => {
      toast.info("publication type creating", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
    onSuccess: () => {
      toast.success("publication type created", {
        icon: false,
        progressClassName: "toastProgress",
      });
      reset();
      queryClient.invalidateQueries("all-publication-types");
      closefn();
    },
    onError: () => {
      toast.error("publication type not created", {
        icon: false,
        progressClassName: "toastProgress",
      });
    },
  });

  const onSubmitHandler = (data: any) => {
    mutate(data);
    console.log(data);
  };

  return (
    <BackDrop>
      <EditPublicationContainer>
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <ModalsContainer>
            <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <h2>Create Publication Type</h2>
              <br />

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

export default AddNewPublication;
