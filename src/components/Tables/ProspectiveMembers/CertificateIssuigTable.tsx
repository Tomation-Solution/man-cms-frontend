import React from "react";
import ProspectiveMembersTable from "./ProspectiveMembersTable";
import { certificatesIssuing } from "../MockData";
//@ts-ignore
import { IndeterminateCheckbox } from "../Checkbox";
import { TableView } from "../Tables.styles";
import { Hooks } from "react-table";
import { Link } from "react-router-dom";
import { datefromatter } from "../../../utils/DateFormatter";
import { getprospectiveMemberSubmission } from "../../../axios/api-calls";
import { useQuery } from "react-query";
import Loading from "../../Loading/Loading";
import { base64ToImage } from "../../../utils/ImageToBase64";

const CertificateIssuigTable = () => {
  const { isLoading, isError, data, isFetching } = useQuery(
    "all-approved-applications",
    ()=>getprospectiveMemberSubmission({'application_status':'final_approval'}),
    {
      // select: (data) => data.data,
      refetchOnWindowFocus: false,
    }
  );
  const columns = [
    {
      Header: "Company Name",
      accessor: "name_of_company",
    },
    {
      Header: "CAC Number",
      accessor: "cac_registration_number",
    },
   
   
  ];
  const tableHooks = (hooks: Hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        Header: "Application Date",
        accessor: "created_at",
        Cell: ({ row }:any) => (
          <>
            {" "}
            {row.original.created_at?datefromatter(new Date(row.original.created_at as string)):''}
          </>
        ),
      },
      {
        Header: "Status",
        id:'Status',
        accessor: "status",
        Cell: ({ row }:any) => (
          <>
          approved
          </>
        ),
      },

      {
        id: "Click to View",
        Header: "Click to Edit",
        Cell: ({ row }:any) => (
          <div>

            <TableView 
          
          onClick={e=>{
            // @ts-ignore
            var circle_canvas = document.getElementById("canvas");
            // @ts-ignore
            
            var context = circle_canvas.getContext("2d");
        
            // Draw Image function
            var img = new Image();
            img.src = 'https://images.unsplash.com/photo-1559588501-59a118c47e59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNlcnRpZmljYXRlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60';
            img.onload = function () {
                context.drawImage(img, 0, 0);
                context.lineWidth = 1;
                context.fillStyle = "red";
                context.lineStyle = "#ffff00";
                context.font = "18px sans-serif";
                context.fillText(row.original.name_of_company, 50, 50);}
                if(circle_canvas){
                  // @ts-ignore
                  // console.log(base64ToImage(bs44img))
                  // console.log(circle_canvas?.toDataURL('png'))
                  window.open(circle_canvas?.toDataURL(),'_blank')
                  // window.open(base64ToImage(bs44img),'_blank')
                }
          }}>
            {" "}
             View Certificate
          </TableView>
          </div>
        ),
      },
      {
        id: "",
        Header: "Click to Edit",
        Cell: ({ row }:any) => (

            <TableView 
          
         >
            {" "}
            <canvas id="canvas" width="200" height="100"  ></canvas>
          </TableView>
        ),
      },
    ]);
  };
  return (
    <>
        <Loading loading={isLoading} />
      {/* {isFetching || isLoading ? (
      ) : !isError ? ( */}
      <ProspectiveMembersTable
        tableColumn={columns}
        tableData={data?data:[]}
        customHooks={[tableHooks]}
      />
      {/* ) : (
        <FormError>Cant Fetch Approved Application</FormError>
      )} */}
    </>
  );
};

export default CertificateIssuigTable;
