import { useQuery } from "react-query";
import { getAllAgmPrograms } from "../../../axios/api-calls";
import TableWithDrawers from "../../../globals/TableWithDrawers";
import { customFetcher } from "../../../utils/customFetcher";
import { AGMProgrmType } from "../../AGMSection/types";
import EmptyState from "../../EmptyState/EmptyState";
import DeleteAGMProgram from "../../Modals/AGMProgramModals/DeleteAGMProgram";
import EditAGMProgram from "../../Modals/AGMProgramModals/EditAGMProgram";

function AGMProgramTable({ id }: { id?: string }) {
  const {
    isLoading: loadingState,
    isError,
    data,
  } = useQuery([`all-programs`, id || ""], () => getAllAgmPrograms({ id }), {
    select(data) {
      return data?.data;
    },
  });

  if (loadingState) {
    return <EmptyState header="loading data" />;
  }

  if (!data || data.length <= 0) {
    return <EmptyState header="Oops there are no programs here" />;
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
          {
            id: 1,
            Header: "Title",
            accessor: "program_title",
          },
          {
            id: 2,
            Header: "Date",
            accessor: "program_date",
          },
        ]}
        tableData={data}
        editModalComponent={EditAGMProgram}
        deleteModalComponent={DeleteAGMProgram}
      />
    </>
  );
}

export default AGMProgramTable;
