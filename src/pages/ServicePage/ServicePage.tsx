import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import OffCanvas from "../../components/OffCanvas/OffCanvas";
import CreateNewsModal from "../../components/Modals/NewsModal/CreateNewsModal";
import Button from "../../components/Button/Button";
import ServicePageModals from "../../components/Modals/ServicePageModals/ServicePageModals";
import { useQuery } from "react-query";
import { getServices } from "../../axios/api-calls";
import Tables from "../../components/Tables/Tables";
import { datefromatter } from "../../utils/DateFormatter";
import { Hooks } from "react-table";




const ServicePage =():React.ReactElement=>{
    const [isOpen, setIsOpen] = useState(false);
    const isMobileScreen = useMediaQuery({ maxWidth: 600 });
    const {isLoading,data} = useQuery('services-list',getServices)
    console.log(data)
    const columns =[
      {
        Header: "S/N",
        accessor: "name",
        id:1,
        Cell: (tableProps:any)=>{
          return <>
          {tableProps.row.index+1}
          </>
      }
      },
      {
        Header: "Name",
        accessor: "name",
      },
    
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Type",
        accessor: "type",
      },
     
    ]
    const tableHooks = (hooks: Hooks) => {
      hooks.visibleColumns.push((columns) =>[...columns,
        {
          id:'Image',
          Header: "Image",
          Cell:({ row }) =>{
            return <>
            <img src={row.values.image} style={{'width':'50px','height':'50px','borderRadius':'10pxz'}} alt="" />
            </>
        }
        },
        {
          id:'CreatedAt',
          Header: "CreatedAt",
          Cell: ({row})=>(
            <>
            {/* {datefromatter(new Date(tableProps.row.created_at))} */}
            {row.values.created_at}
            </>
          )
        },
        {
          id:'UpdatedAt',
          Header: "UpdatedAt",
          Cell: ({row})=>(
            <>
            {datefromatter(new Date(row.values.updated_at))}
            </>
          )
        },
      ])
    }
    return (
        <div>
        <OffCanvas
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {/* <CreateNewsModal closefn={() => setIsOpen(!isOpen)} /> */}
        <ServicePageModals />
      </OffCanvas>
      <Button styleType={"sec"} onClick={() => setIsOpen(true)}>
          Create Service
        </Button>

        <br />
        <Tables
          tableColumn={columns}
          tableData={
            data?data:[]
          }
          customHooks={[tableHooks]}
        />
        </div>
    )
}

export default ServicePage