import React, { useState } from "react";
import BackDrop from "../../BackDrop/BackDrop";
import { GalleryModalContainer } from "./GalleryModal.styles";
import Button from "../../Button/Button";
import { GrClose } from "react-icons/gr";
import { useQuery } from "react-query";
import { galleryRetrieve } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { FormError, Header } from "../../../globals/styles/forms.styles";
import GalleryItemAddModal from "./GalleryItemAddModal";
import GalleryDelete from "./GalleryDelete";
import GalleryItemEdit from "./GalleryItemEdit";

const GalleryModal: React.FC<{ closefn: () => void; galleryid?: number }> = ({
  closefn,
  galleryid,
}) => {
  const [showGalleryAdd, setShowGalleryAdd] = useState(false);
  const [galleryId, setGalleryId] = useState(0);
  const [galleryName, setGalleryName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { isLoading, isFetching, isError, data } = useQuery(
    `gallery-item-${galleryid}`,
    () => galleryRetrieve(galleryid as number),
    {
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      {showGalleryAdd && (
        <GalleryItemAddModal
          galleryid={galleryid as number}
          closefn={() => setShowGalleryAdd(!showGalleryAdd)}
        />
      )}
      {showDeleteModal && (
        <GalleryDelete
          galleryItem={true}
          galleryId={galleryId}
          galleryName={galleryName}
          closefn={() => setShowDeleteModal(!showDeleteModal)}
        />
      )}
      {showEditModal && (
        <GalleryItemEdit
          closefn={() => setShowEditModal(!showEditModal)}
          galleryItemId={galleryId}
        />
      )}
      <BackDrop>
        {isLoading || isFetching ? (
          <Loading light loading={isLoading || isFetching} />
        ) : !isError ? (
          <GalleryModalContainer>
            <div className="close-btn">
              <GrClose onClick={closefn} />
            </div>

            <div className="title-add-more">
              <h1>{data.name}</h1>

              <Button onClick={() => setShowGalleryAdd(!showGalleryAdd)}>
                Add Gallery Item
              </Button>
            </div>

            <div className="gallery-scroll">
              <div className="gallery-modal-items">
                {data?.gallery_images.map(
                  (
                    item: { id: number; caption: string; image: string },
                    index: number
                  ) => (
                    <div className="gallery-modal-item" key={index}>
                      <img alt="" src={item.image} />
                      <p>{item.caption}</p>
                      <div className="gallery-modal-btn">
                        <Button
                          isSmall
                          onClick={() => {
                            setGalleryId(item.id);
                            setShowEditModal(!showEditModal);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          isSmall
                          onClick={() => {
                            setGalleryId(item.id);
                            setGalleryName(item.caption);
                            setShowDeleteModal(!showDeleteModal);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </GalleryModalContainer>
        ) : (
          <FormError>Can't Fetch Gallery Item</FormError>
        )}
      </BackDrop>
    </>
  );
};

export default GalleryModal;
