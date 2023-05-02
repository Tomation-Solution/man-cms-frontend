import React, { useState } from "react";
import { FormError } from "../../../globals/styles/forms.styles";
import Tables from "../Tables";
import Loading from "../../Loading/Loading";
import { useQuery } from "react-query";
import { useMediaQuery } from "react-responsive";
import { Hooks } from "react-table";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { TableView, TableReject } from "../Tables.styles";
import { joinStepGetAll } from "../../../axios/api-calls";
import JoinStepEdit from "../../Modals/JoinStep/JoinStepEdit";
import JoinStepDelete from "../../Modals/JoinStep/JoinStepDelete";

const JoinStepTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(0);
  const [delId, setDelId] = useState(0);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

  const closeSlider = () => {
    setIsOpen(!isOpen);
  };
  const closeDeleteSlider = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  const { isLoading, isError, data, isFetching } = useQuery(
    "all-join-step",
    joinStepGetAll,
    {
      select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );

  const columns = [
    {
      Header: "S/N",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "step_name",
    },
  ];

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }) => (
          <TableView
            onClick={() => {
              setId(row.values.id);
              closeSlider();
            }}
          >
            Edit
          </TableView>
        ),
      },
      {
        id: "Click to Delete",
        Header: "Click to Delete",
        Cell: ({ row }) => (
          <TableReject
            onClick={() => {
              setDelId(row.values.id);
              closeDeleteSlider();
            }}
          >
            Delete
          </TableReject>
        ),
      },
    ]);
  };

  return (
    <>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <JoinStepEdit closefn={closeSlider} joinId={id} />
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        {/* <WhyJoinDelete closefn={closeDeleteSlider} whyId={delId} /> */}
        <JoinStepDelete closefn={closeDeleteSlider} joinId={delId} />
      </OffCanvas>

      {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? (
        <Tables
          tableColumn={columns}
          tableData={data}
          customHooks={[tableHooks]}
        />
      ) : (
        <FormError>Can't Fetch Join Step Data</FormError>
      )}
    </>
  );
};

export default JoinStepTable;
