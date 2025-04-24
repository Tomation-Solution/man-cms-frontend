import { useQuery } from "react-query";
import { getAllAgmFaq } from "../../../axios/api-calls";
import TableWithDrawers from "../../../globals/TableWithDrawers";
import { customFetcher } from "../../../utils/customFetcher";
import { AGMFaqType } from "../../AGMSection/types";
import EmptyState from "../../EmptyState/EmptyState";
import DeleteAGMFaq from "../../Modals/AGMFaqModals/DeleteAGMFaq";
import EditAGMFaq from "../../Modals/AGMFaqModals/EditAGMFaq";
import sanitizeHtml from "sanitize-html";

function AGMFaqTable({ id }: { id?: string }) {
  // const { loadingState, isError, data } = customFetcher<AGMFaqType[]>(
  //   "all-agm-faqs",
  //   getAllAgmFaq
  // );

  const {
    isLoading: loadingState,
    isError,
    data,
  } = useQuery([`all-agm-faqs`, id || ""], () => getAllAgmFaq({ id }), {
    select(data) {
      return data?.data;
    },
  });

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
      columns={[
        {
          id: 1,
          Header: "Header",
          accessor: "header",
        },

        {
          id: 2,
          Header: "Content",
          accessor: "content",
          Cell: (tableProps: any) => {
            const cellContent = sanitizeHtml(tableProps.row.original.content);
            return <div dangerouslySetInnerHTML={{ __html: cellContent }} />;
          },
        },
      ]}
      tableData={data}
      editModalComponent={EditAGMFaq}
      deleteModalComponent={DeleteAGMFaq}
    />
  );
}

export default AGMFaqTable;
