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

  const [url, setUrl] = useState("/gallery/");
  const [data, setData] = useState<any[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

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
      setData(
        results.results.sort(
          (a: { updated_at: any }, b: { updated_at: any }) =>
            new Date(String(b.updated_at)).getTime() -
            new Date(String(a.updated_at)).getTime()
        )
      );
      setNextUrl(results.next || null);
      setPrevUrl(results.previous || null);
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
              closefn={() => setShowModal(false)}
            />
          )}
          {showDeleteModal && (
            <GalleryDelete
              galleryId={galleryId}
              galleryName={galleryName}
              closefn={() => setShowDeleteModal(false)}
            />
          )}
          {showRenameModal && (
            <GalleryRename
              galleryId={galleryId}
              galleryName={galleryName}
              closefn={() => setShowRenameModal(false)}
            />
          )}

          <OffCanvas
            size={isMobileScreen ? 100 : 50}
            btnClick={() => null}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          >
            <GalleryCreateModal closefn={() => setIsOpen(false)} />
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
                        setShowRenameModal(true);
                      }}
                    >
                      Rename
                    </Button>
                    <Button
                      isSmall
                      onClick={() => {
                        setGalleryId(item.id);
                        setShowModal(true);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      isSmall
                      onClick={() => {
                        setGalleryId(item.id);
                        setGalleryName(item.name);
                        setShowDeleteModal(true);
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
                justifyContent: "space-between",
                paddingTop: "2rem",
                paddingBottom: "2rem",
              }}
            >
              <Button
                disabled={!prevUrl}
                style={{ opacity: prevUrl ? "1" : "0.5" }}
                onClick={() => setUrl(prevUrl!)}
              >
                Previous
              </Button>
              <Button
                disabled={!nextUrl}
                style={{ opacity: nextUrl ? "1" : "0.5" }}
                onClick={() => setUrl(nextUrl!)}
              >
                Next
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
