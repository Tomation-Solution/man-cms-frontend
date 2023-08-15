import CreateDrawer from "../../globals/CreateDrawer";
import CreateAGMSpeaker from "../Modals/AGMSpeakersModals/CreateAGMSpeaker";
import AGMSpeakersTable from "../Tables/AGMSectionTables/AGMSpeakersTable";

function AGMSpeakers() {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateAGMSpeaker}
        tableComponent={AGMSpeakersTable}
      />
    </>
  );
}

export default AGMSpeakers;
