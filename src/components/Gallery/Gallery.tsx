import React, { useState } from "react";
import { GalleryContainer } from "./Gallery.styles";
import GalleryModal from "../Modals/GalleryModals/GalleryModal";
import OffCanvas from "../OffCanvas/OffCanvas";
import { useMediaQuery } from "react-responsive";
import Button from "../Button/Button";
import GalleryCreateModal from "../Modals/GalleryModals/GalleryCreateModal";
import { useQuery } from "react-query";
import { galleryGetAll } from "../../axios/api-calls";
import Loading from "../Loading/Loading";
import { FormError } from "../../globals/styles/forms.styles";

const Gallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const { isLoading, isFetching, isError, data } = useQuery(
    "all-gallery",
    galleryGetAll,
    {
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    }
  );
  console.log(data);
  return (
    <>
      {isLoading || isFetching ? (
        <Loading loading={isLoading || isFetching} />
      ) : !isError ? (
        <>
          {showModal && (
            <GalleryModal closefn={() => setShowModal(!showModal)} />
          )}
          <OffCanvas
            size={isMobileScreen ? 100 : 50}
            btnClick={() => null}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          >
            <GalleryCreateModal closefn={() => setIsOpen(!isOpen)} />
          </OffCanvas>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
              Create New
            </Button>
          </div>
          <br />

          <GalleryContainer>
            <div className="gallery-items">
              {data.map((item: any, index: number) => (
                <div className="gallery-item" key={index}>
                  <p>Image Folder</p>
                  <small>Created on: 2023-03-10</small>

                  <div className="gallery-modal-btn">
                    <Button isSmall onClick={() => setShowModal(!showModal)}>
                      View
                    </Button>
                    <Button isSmall>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </GalleryContainer>
        </>
      ) : (
        <FormError>Can't Fetch Gallery Images</FormError>
      )}
    </>
  );
};

export default Gallery;
