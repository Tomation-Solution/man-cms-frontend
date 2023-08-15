import { getAllAgmSpeakers } from "../../../axios/api-calls";
import TableWithDrawers from "../../../globals/TableWithDrawers";
import { customFetcher } from "../../../utils/customFetcher";
import { AGMSpeakerType } from "../../AGMSection/types";
import EmptyState from "../../EmptyState/EmptyState";
import DeleteAGMSpeaker from "../../Modals/AGMSpeakersModals/DeleteAGMSpeaker";
import EditAGMSpeaker from "../../Modals/AGMSpeakersModals/EditAGMSpeaker";

function AGMSpeakersTable() {
  const { loadingState, isError, data } = customFetcher<AGMSpeakerType[]>(
    "all-speaker",
    getAllAgmSpeakers
  );

  if (loadingState) {
    return <EmptyState header="loading data" />;
  }

  if (!data || data?.length <= 0) {
    return <EmptyState header="Oops theres no data here" />;
  }
  if (isError) {
    return (
      <EmptyState
        header="Oops something went wrong"
        subHeader="try again later"
      />
    );
  }

  return (
    <>
      <TableWithDrawers
        columns={[
          { id: 1, Header: "Speaker Name", accessor: "speaker_name" },
          { id: 2, Header: "Speaker Title", accessor: "speaker_title" },
        ]}
        tableData={data}
        editModalComponent={EditAGMSpeaker}
        deleteModalComponent={DeleteAGMSpeaker}
      />
    </>
  );
}

export default AGMSpeakersTable;
