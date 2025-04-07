import React, { useEffect, useState } from "react";
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
  const [data, setData] = useState<any>();

  const [nextUrl, setNextUrl] = useState<string>();
  const [url, setUrl] = useState("");
  const [updateNext, setUpdateNext] = useState(true);

  const {
    isLoading,
    isFetching,
    isError,
    data: results,
  } = useQuery(
    [`gallery-item-${galleryid}`, url],
    () => galleryRetrieve(galleryid as number, url),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (results?.results) {
      setData((prevData: any) => {
        const fetchedResults = results?.results;
        if (!fetchedResults) return prevData;

        const existingIds = new Set(
          (prevData?.gallery_items || []).map((item: any) => item.id)
        ); // Track existing gallery item IDs

        // Filter out duplicates and merge new gallery items
        const newGalleryItems =
          fetchedResults.gallery_items?.filter(
            (item: any) => !existingIds.has(item.id)
          ) || [];

        const updatedGalleryItems = [
          ...(prevData?.gallery_items || []),
          ...newGalleryItems,
        ].sort(
          (a, b) =>
            new Date(String(b.updated_at)).getTime() -
            new Date(String(a.updated_at)).getTime() // Sort by latest updated
        );

        return {
          ...fetchedResults,
          gallery_items: updatedGalleryItems,
        };
      });

      if (updateNext) {
        setNextUrl(results.next || null);
      }
      setUpdateNext(true);
    }
  }, [results]);

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
              <h1>{data?.name}</h1>

              <Button onClick={() => setShowGalleryAdd(!showGalleryAdd)}>
                Add Gallery Item
              </Button>
            </div>

            <div className="gallery-scroll">
              <div className="gallery-modal-items">
                {data?.gallery_items?.map(
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
          </GalleryModalContainer>
        ) : (
          <FormError>Can't Fetch Gallery Item</FormError>
        )}
      </BackDrop>
    </>
  );
};

export default GalleryModal;
