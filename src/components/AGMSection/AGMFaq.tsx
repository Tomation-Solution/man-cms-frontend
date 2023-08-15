import CreateDrawer from "../../globals/CreateDrawer";
import CreateAGMFaq from "../Modals/AGMFaqModals/CreateAGMFaq";
import AGMFaqTable from "../Tables/AGMSectionTables/AGMFaqTable";

function AGMFaq() {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateAGMFaq}
        tableComponent={AGMFaqTable}
      />
    </>
  );
}

export default AGMFaq;
