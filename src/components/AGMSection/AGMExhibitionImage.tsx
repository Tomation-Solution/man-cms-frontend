import CreateDrawer from "../../globals/CreateDrawer";
import CreateExhibitionImage from "../Modals/AGMExhibitionImageSection/CreateExhibitionImage";
import AGMExhibitionImageTable from "../Tables/AGMSectionTables/AGMExhibitionImageTable";

function AGMExhibitionImage() {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateExhibitionImage}
        tableComponent={AGMExhibitionImageTable}
      />
    </>
  );
}

export default AGMExhibitionImage;
