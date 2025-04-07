import React, { useEffect } from "react";
import { TableReject, TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import Tables from "../Tables";
import { useQuery } from "react-query";
import { reportsGetAll } from "../../../axios/api-calls";
import Loading from "../../Loading/Loading";
import { FormError } from "../../../globals/styles/forms.styles";
import OffCanvas from "../../OffCanvas/OffCanvas";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import EditReportsModal from "../../Modals/ReportsModal/NewEditReportModal";
import DeleteReportsModal from "../../Modals/ReportsModal/DeleteReportsModal";
import Button from "../../Button/Button";

const ReportTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(0);

  const [delId, setDelId] = useState(0);
  const [delName, setDelName] = useState("");
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });
  const [data, setData] = useState<any[]>([]);

  const [nextUrl, setNextUrl] = useState("");
  const [url, setUrl] = useState(`/reports/`);
  const [updateNext, setUpdateNext] = useState<boolean>(true);

  const closeSlider = () => {
    setIsOpen(!isOpen);
  };
  const closeDeleteSlider = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  const {
    isLoading,
    isError,
    data: results,
    isFetching,
  } = useQuery(["all-reports", url], () => reportsGetAll(url), {
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      id: "s/n",
      Header: "S/N",
      Cell: (tableProp: any) => <>{tableProp.row.index + 1}</>,
    },
    {
      Header: "Name",
      accessor: "name",
    },
  ];

  useEffect(() => {
    if (!results) {
      setData((prevdata: any) => {
        if (prevdata.length) return prevdata;
        return [];
      });
    }

    if (results?.results) {
      setData((prevData: any[]) => {
        const existingIds = new Set(prevData.map((item) => item.id));
        const newData = results.results.filter(
          (item: any) => !existingIds.has(item.id)
        ); // Filter out duplicates

        const mergedData = [...prevData, ...newData]; // Append only new unique items
        return mergedData.sort(
          (a, b) =>
            new Date(String(b.updated_at)).getTime() -
            new Date(String(a.updated_at)).getTime()
        );
      });

      if (updateNext) {
        setNextUrl(results.next || null);
      }
      setUpdateNext(true);

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth", // Optional: adds smooth scrolling effect
        });
      }, 500);
    }
  }, [results]);

  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }) => (
          <TableView
            onClick={() => {
              setId(Number((row.original as any).id));
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
              setDelId(Number((row.original as any).id));
              setDelName(String((row.original as any).name));
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
        <EditReportsModal reportId={id} closefn={closeSlider} />
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <DeleteReportsModal
          reportId={delId}
          closefn={closeDeleteSlider}
          reportName={delName}
        />
      </OffCanvas>

      {isFetching || isLoading ? (
        <Loading loading={isFetching || isLoading} />
      ) : !isError ? (
        <Tables
          tableColumn={columns}
          tableData={data || []}
          customHooks={[tableHooks]}
        />
      ) : (
        <FormError>Cant Fetch Publications</FormError>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Button
          style={{
            opacity: !nextUrl ? "0.5" : "1",
          }}
          disabled={!nextUrl}
          onClick={() => setUrl(nextUrl!)}
        >
          Load More
        </Button>
      </div>
    </>
  );
};

export default ReportTable;
