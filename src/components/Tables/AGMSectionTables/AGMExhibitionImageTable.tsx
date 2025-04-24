import { useQuery } from "react-query";
import { getAllAgmExhibitionImages } from "../../../axios/api-calls";
import TableWithDrawers from "../../../globals/TableWithDrawers";
import { SelectImage } from "../../../globals/styles/CustomFormComponents";
import EmptyState from "../../EmptyState/EmptyState";
import DeleteExhibitionImage from "../../Modals/AGMExhibitionImageSection/DeleteExhibitionImage";

function AGMExhibitionImageTable({ id }: { id?: string }) {
  // const { loadingState, isError, data } = customFetcher<any[]>(
  //   "all-previous-exhibition",
  //   getAllAgmExhibitionImages
  // );

  const {
    isLoading: loadingState,
    isError,
    data,
  } = useQuery(
    [`all-previous-exhibition`, id || ""],
    () => getAllAgmExhibitionImages({ id }),
    {
      select(data) {
        return data?.data;
      },
    }
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
  const editEmpty = () => <div>nothing here</div>;

  return (
    <TableWithDrawers
      columns={[
        {
          id: 1,
          Header: "Image",
          accessor: "image",
          Cell: (tableProps: any) => (
            <div style={{ width: "300px" }}>
              <SelectImage image={tableProps.row.original.image} />
            </div>
          ),
        },
        {
          id: 2,
          Header: "Type",
          accessor: "type",
          Cell: (tableProps: any) => (
            <p>{tableProps.row.original.type} image</p>
          ),
        },
      ]}
      noEdit
      tableData={data}
      editModalComponent={editEmpty}
      deleteModalComponent={DeleteExhibitionImage}
    />
  );
}

export default AGMExhibitionImageTable;
