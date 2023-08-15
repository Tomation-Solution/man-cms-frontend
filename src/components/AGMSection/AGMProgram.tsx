import CreateDrawer from "../../globals/CreateDrawer";
import CreateAGMProgram from "../Modals/AGMProgramModals/CreateAGMProgram";
import AGMProgramTable from "../Tables/AGMSectionTables/AGMProgramTable";

function AGMProgram() {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateAGMProgram}
        tableComponent={AGMProgramTable}
      />
    </>
  );
}

export default AGMProgram;
