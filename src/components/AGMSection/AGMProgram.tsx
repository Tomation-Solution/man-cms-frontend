import CreateDrawer from "../../globals/CreateDrawer";
import CreateAGMProgram from "../Modals/AGMProgramModals/CreateAGMProgram";
import AGMProgramTable from "../Tables/AGMSectionTables/AGMProgramTable";

function AGMProgram({ id }: { id?: string }) {
  return (
    <>
      <CreateDrawer
        createModalComponent={CreateAGMProgram}
        tableComponent={AGMProgramTable}
        id={id}
      />
    </>
  );
}

export default AGMProgram;
