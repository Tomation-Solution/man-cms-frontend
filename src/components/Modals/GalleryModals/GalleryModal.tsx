import React from "react";
import BackDrop from "../../BackDrop/BackDrop";
import { GalleryModalContainer } from "./GalleryModal.styles";
import Button from "../../Button/Button";
import { GrClose } from "react-icons/gr";

const GalleryModal: React.FC<{ closefn: () => void; galleryid?: number }> = ({
  closefn,
}) => {
  return (
    <BackDrop>
      <GalleryModalContainer>
        <div className="close-btn">
          <GrClose onClick={closefn} />
        </div>

        <div className="gallery-scroll">
          <div className="gallery-modal-items">
            {[...Array(5)].map((item, index) => (
              <div className="gallery-modal-item" key={index}>
                <img alt="" src="" />
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Culpa, ipsam tenetur, veniam sint itaque excepturi quidem
                  inventore eos magnam ab odit. Animi quas, laudantium corrupti
                  tempore accusamus exercitationem hic. Iste!
                </p>
                <div className="gallery-modal-btn">
                  <Button isSmall>Edit</Button>
                  <Button isSmall>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GalleryModalContainer>
    </BackDrop>
  );
};

export default GalleryModal;
