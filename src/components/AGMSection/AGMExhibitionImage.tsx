import CreateDrawer from "../../globals/CreateDrawer";
import CreateExhibitionImage from "../Modals/AGMExhibitionImageSection/CreateExhibitionImage";
import AGMExhibitionImageTable from "../Tables/AGMSectionTables/AGMExhibitionImageTable";

function AGMExhibitionImage({ id }: { id?: string }) {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateExhibitionImage}
        tableComponent={AGMExhibitionImageTable}
        id={id}
      />
    </>
  );
}

export default AGMExhibitionImage;
