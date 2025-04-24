import CreateDrawer from "../../globals/CreateDrawer";
import CreateAGMSpeaker from "../Modals/AGMSpeakersModals/CreateAGMSpeaker";
import AGMSpeakersTable from "../Tables/AGMSectionTables/AGMSpeakersTable";

function AGMSpeakers({ id }: { id?: string }) {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateAGMSpeaker}
        tableComponent={AGMSpeakersTable}
        id={id}
      />
    </>
  );
}

export default AGMSpeakers;
