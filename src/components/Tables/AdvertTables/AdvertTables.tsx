import { getAllAdverts } from "../../../axios/api-calls";
import TableWithDrawers from "../../../globals/TableWithDrawers";
import { SelectImage } from "../../../globals/styles/CustomFormComponents";
import { customFetcher } from "../../../utils/customFetcher";
import { AdvertType } from "../../AdvertSection/types";
import EmptyState from "../../EmptyState/EmptyState";
import DeleteAdvertModals from "../../Modals/AdvertModals/DeleteAdvertModals";

function AdvertTables() {
  const { loadingState, isError, data } = customFetcher<AdvertType[]>(
    "all-adverts",
    getAllAdverts
  );

  const noEditComponent = () => <h1>Nothing here</h1>;

  if (loadingState) {
    return <EmptyState header="loading data" />;
  }

  if (!data || data.length <= 0) {
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
    <TableWithDrawers
      noEdit
      editModalComponent={noEditComponent}
      deleteModalComponent={DeleteAdvertModals}
      columns={[
        { id: 1, Header: "Text", accessor: "text" },
        {
          id: 2,
          Header: "Image",
          accessor: "image",
          Cell: (tableProps: any) => {
            return (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                }}
              >
                <SelectImage image={tableProps.row.original.image} />
              </div>
            );
          },
        },
      ]}
      tableData={data}
    />
  );
}

export default AdvertTables;
