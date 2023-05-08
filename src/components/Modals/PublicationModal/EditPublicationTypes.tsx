import React, { useState } from "react";
import { ModalsContainer } from "../Modals.styles";
import {
  Form,
  FormError,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  publicationTypesDelete,
  publicationTypesGetAll,
} from "../../../axios/api-calls";
import BackDrop from "../../BackDrop/BackDrop";
import Loading from "../../Loading/Loading";
import { EditPublicationContainer } from "./PublicationModals.styles";
import { CustomModalButton } from "../../../globals/styles/CustomFormComponents";
import Button from "../../Button/Button";
import RenamePublication from "./RenamePublication";
import { toast } from "react-toastify";
import AddNewPublication from "./AddNewPublication";

const EditPublicationTypes: React.FC<{ closefn: () => void }> = ({
  closefn,
}) => {
  const queryClient = useQueryClient();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showTypeId, setShowTypeId] = useState(0);
  const [showTypeName, setShowTypeName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { isLoading, isFetching, isError, data } = useQuery(
    "all-publication-types",
    publicationTypesGetAll,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate, isLoading: deleteLoading } = useMutation(
    publicationTypesDelete,
    {
      onMutate: () => {
        toast.info("publication type deleteing", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
      onSuccess: () => {
        toast.success("publication type deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
        queryClient.invalidateQueries("all-publication-types");
        closefn();
      },
      onError: () => {
        toast.error("publication type not deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );

  const onDeleteHandler = (id: number) => {
    mutate(id);
  };

  return (
    <BackDrop>
      {showRenameModal && (
        <RenamePublication
          closefn={() => setShowRenameModal(!showRenameModal)}
          typeId={showTypeId}
          typedName={showTypeName}
        />
      )}

      {showCreateModal && (
        <AddNewPublication
          closefn={() => setShowCreateModal(!showCreateModal)}
        />
      )}

      {isLoading || isFetching || deleteLoading ? (
        <Loading loading={isLoading || isFetching || deleteLoading} />
      ) : !isError ? (
        <EditPublicationContainer>
          <h1>Edit Publication Type</h1>
          <br />
          {data.map((item: { name: string; id: number }, index: number) => (
            <div className="publications-items" key={index}>
              <p>{item.name}</p>
              <div className="publication-items-btn">
                <Button
                  isSmall
                  styleType="sec"
                  onClick={() => {
                    setShowTypeId(item.id);
                    setShowTypeName(item.name);
                    setShowRenameModal(!showRenameModal);
                  }}
                >
                  Rename
                </Button>

                <Button
                  isSmall
                  onClick={() => {
                    onDeleteHandler(item.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <div>
            <CustomModalButton
              clickfn={() => setShowCreateModal(!showCreateModal)}
            >
              Add New
            </CustomModalButton>
            <CustomModalButton clickfn={closefn}>CLOSE</CustomModalButton>
          </div>
        </EditPublicationContainer>
      ) : (
        <FormError>Can't Get Publication Types</FormError>
      )}
    </BackDrop>
  );
};

export default EditPublicationTypes;
