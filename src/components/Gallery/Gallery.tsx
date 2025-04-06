import React, { useEffect, useState } from "react";
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
import { datefromatter } from "../../utils/DateFormatter";
import GalleryDelete from "../Modals/GalleryModals/GalleryDelete";
import GalleryRename from "../Modals/GalleryModals/GalleryRename";

const Gallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const [galleryId, setGalleryId] = useState(0);
  const [galleryName, setGalleryName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [url, setUrl] = useState("/gallery/");
  const [updateNext, setUpdateNext] = useState<boolean>(true);

  const {
    isLoading,
    isFetching,
    isError,
    data: results,
  } = useQuery(["all-gallery", url], () => galleryGetAll(url), {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (results?.results) {
      setData((prevData) => {
        const existingIds = new Set(prevData.map((item) => item.id)); // Track existing IDs
        const newData = results.results.filter(
          (item: any) => !existingIds.has(item.id)
        ); // Filter out duplicates

        const mergedData = [...prevData, ...newData]; // Append only new unique items
        return mergedData.sort(
          (a, b) =>
            new Date(String(b.updated_at)).getTime() -
            new Date(String(a.updated_at)).getTime()
        );
      });

      if (updateNext) {
        setNextUrl(results.next || null);
      }
      setUpdateNext(true);
    }
  }, [results]);

  return (
    <>
      {isLoading || isFetching ? (
        <Loading loading={isLoading || isFetching} />
      ) : !isError ? (
        <>
          {showModal && (
            <GalleryModal
              galleryid={galleryId}
              closefn={() => setShowModal(!showModal)}
            />
          )}
          {showDeleteModal && (
            <GalleryDelete
              galleryId={galleryId}
              galleryName={galleryName}
              closefn={() => setShowDeleteModal(!showDeleteModal)}
            />
          )}
          {showRenameModal && (
            <GalleryRename
              galleryId={galleryId}
              galleryName={galleryName}
              closefn={() => setShowRenameModal(!showRenameModal)}
            />
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
            <Button
              styleType={"sec"}
              onClick={() => {
                setIsOpen(true);
                setUrl("/gallery/");
                setUpdateNext(false);
              }}
            >
              Create New
            </Button>
          </div>
          <br />

          <GalleryContainer>
            <div className="gallery-items">
              {data.map((item: any, index: number) => (
                <div className="gallery-item" key={index}>
                  <p>{item.name}</p>
                  <small>
                    Created on: {datefromatter(new Date(item.created_at))}
                  </small>

                  <div className="gallery-modal-btn">
                    <Button
                      isSmall
                      onClick={() => {
                        setGalleryId(item.id);
                        setGalleryName(item.name);
                        setShowRenameModal(!showRenameModal);
                      }}
                    >
                      Rename
                    </Button>
                    <Button
                      isSmall
                      onClick={() => {
                        setGalleryId(item.id);
                        setShowModal(!showModal);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      isSmall
                      onClick={() => {
                        setGalleryId(item.id);
                        setGalleryName(item.name);
                        setShowDeleteModal(!showDeleteModal);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                paddingTop: "2rem",
                paddingBottom: "2rem",
              }}
            >
              <Button
                style={{
                  opacity: !nextUrl ? "0.5" : "1",
                }}
                disabled={!nextUrl}
                onClick={() => setUrl(nextUrl!)}
              >
                Load More
              </Button>
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
