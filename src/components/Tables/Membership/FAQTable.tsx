import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMediaQuery } from "react-responsive";
import { Hooks } from "react-table";
import { faqGetAll } from "../../../axios/api-calls";
import { FormError } from "../../../globals/styles/forms.styles";
import Loading from "../../Loading/Loading";
import OffCanvas from "../../OffCanvas/OffCanvas";
import Tables from "../Tables";
import { TableView, TableReject } from "../Tables.styles";
import FAQSEdit from "../../Modals/FAQS/FAQSEdit";
import FAQSDelete from "../../Modals/FAQS/FAQSDelete";
import Button from "../../Button/Button";

const FAQTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [id, setId] = useState(0);

  const [data, setData] = useState<any>([]);
  const [nextUrl, setNextUrl] = useState("");
  const [updateNext, setUpdateNext] = useState(true);

  const [url, setUrl] = useState(`/membership/faq`);
  const [delId, setDelId] = useState(0);
  const isMobileScreen = useMediaQuery({ maxWidth: 600 });

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
  } = useQuery(["all-faqs", url], () => faqGetAll(url), {
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      id: "s/n",
      Header: "S/N",
      Cell: (tableProp: any) => <>{tableProp.row.index + 1}</>,
    },
    {
      Header: "Header",
      accessor: "header",
    },
  ];

  useEffect(() => {
    if (results?.results) {
      setData((prevData: any[]) => {
        const existingIds = new Set(prevData.map((item) => item.id));
        const newData = results.results.data.filter(
          (item: any) => !existingIds.has(item.id)
        ); // Filter out duplicates

        const mergedData = [...prevData, ...newData]; // Append only new unique items
        return mergedData;
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
              console.log("row", row);

              setId((row.original as any).id);
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
              setDelId((row.original as any).id);
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
        <FAQSEdit closefn={closeSlider} faqId={id} />
      </OffCanvas>
      <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsDeleteOpen}
        isOpen={isDeleteOpen}
      >
        <FAQSDelete closefn={closeDeleteSlider} joinId={delId} />
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
        <FormError>Can't Fetch Why Join Data</FormError>
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

export default FAQTable;
