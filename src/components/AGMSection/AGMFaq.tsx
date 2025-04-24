import CreateDrawer from "../../globals/CreateDrawer";
import CreateAGMFaq from "../Modals/AGMFaqModals/CreateAGMFaq";
import AGMFaqTable from "../Tables/AGMSectionTables/AGMFaqTable";

function AGMFaq({ id }: { id?: string }) {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateAGMFaq}
        tableComponent={AGMFaqTable}
        id={id}
      />
    </>
  );
}

export default AGMFaq;
