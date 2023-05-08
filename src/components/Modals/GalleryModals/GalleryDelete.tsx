import React from "react";
import { GalleryItemDeleteContainer } from "./GalleryModal.styles";
import Button from "../../Button/Button";
import { useMutation, useQueryClient } from "react-query";
import { galleryDelete, galleryItemDelete } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import BackDrop from "../../BackDrop/BackDrop";
import { toast } from "react-toastify";

const GalleryDelete: React.FC<{
  galleryId: number;
  galleryName: string;
  galleryItem?: boolean;
  closefn: () => void;
}> = ({ galleryId, galleryName, closefn, galleryItem }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (galleryId: number) => galleryDelete(galleryId),
    {
      onMutate: () => {
        toast.info("gallery deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("gallery deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-gallery");
        closefn();
      },
      onError: () => {
        toast.error("gallery not deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    }
  );
  const { mutate: mutateGalleryItem, isLoading: loadingGalleryItem } =
    useMutation((galleryId: number) => galleryItemDelete(galleryId), {
      onMutate: () => {
        toast.info("gallery item deleting...", {
          progressClassName: "toastProgress",
          icon: false,
        });
      },
      onSuccess: () => {
        toast.success("gallery item deleted", {
          progressClassName: "toastProgress",
          icon: false,
        });
        queryClient.invalidateQueries("all-gallery");
        closefn();
      },
      onError: () => {
        toast.error("gallery item not deleted", {
          icon: false,
          progressClassName: "toastProgress",
        });
      },
    });

  const onDeleteHandler = () => {
    if (galleryItem) {
      mutateGalleryItem(galleryId);
    } else {
      mutate(galleryId);
    }
  };

  return (
    <>
      <BackDrop overlay={true}>
        {isLoading || loadingGalleryItem ? (
          <Loading loading={isLoading || loadingGalleryItem} />
        ) : (
          <GalleryItemDeleteContainer>
            {galleryItem ? (
              <p>Confirm Deletion of Gallery Item: {galleryName}</p>
            ) : (
              <p>Confirm Deletion of Gallery: {galleryName}</p>
            )}
            <div className="gallery-sides">
              <Button onClick={onDeleteHandler}>Delete</Button>
              <Button styleType="sec" onClick={closefn}>
                Cancel
              </Button>
            </div>
          </GalleryItemDeleteContainer>
        )}
      </BackDrop>
    </>
  );
};

export default GalleryDelete;
