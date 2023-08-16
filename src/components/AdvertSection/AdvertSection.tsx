import CreateDrawer from "../../globals/CreateDrawer";
import CreateAdvertModals from "../Modals/AdvertModals/CreateAdvertModals";
import AdvertTables from "../Tables/AdvertTables/AdvertTables";

function AdvertSection() {
  return (
    <CreateDrawer
      createModalComponent={CreateAdvertModals}
      tableComponent={AdvertTables}
    />
  );
}

export default AdvertSection;
