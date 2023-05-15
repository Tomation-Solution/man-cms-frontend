import { Hooks } from "react-table"
import { TableReject, TableView } from "../Tables/Tables.styles"
import Button from "../Button/Button"
import Tables from "../Tables/Tables"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { deleteExecutiveApi, getExecutiveApi } from "../../axios/api-calls"
import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import OffCanvas from "../OffCanvas/OffCanvas"
import CreateOurExcutiveModal, { UpdateOurExcutiveModal } from "../Modals/OurExcutive"
import Loading from "../Loading/Loading"




const OurExcutive = ()=>{
    const queryClient = useQueryClient();
    const isMobileScreen = useMediaQuery({ maxWidth: 600 });
    const [currentData,setCurrentData] =useState<any>()
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenupdate, setIsOpenUpdate] = useState(false);
    const {isLoading,data} = useQuery('getExecutiveApi',getExecutiveApi)
    const {isLoading:deleteing,mutate:deleteExecutive} = useMutation(deleteExecutiveApi,{
        'onSuccess':(data)=>{
            queryClient.invalidateQueries('getExecutiveApi')
        }
    })
    const columnsExcutive =[
        {
            Header:'Name',
            accessor:'name',
            id:1
          },
          {
            Header:'Title',
            accessor:'title',
            id:2
          },
          {
            Header:'Type',
            accessor:'type',
            id:3  
        },
        //   {
        //     Header:'Extra Title One',
        //     accessor:'extra_title1',
        //     id:4  
        // },
        //   {
        //     Header:'Extra Title Two',
        //     accessor:'extra_title2',
        //     id:5  
        // },
        //   {
        //     Headers:'image',
        //     accessor:'image',
        //   },
    ]

    const tableHooks = (hooks: Hooks) =>{
        hooks.visibleColumns.push((columns) =>[
            {
                id:'s/n',
                Header:'S/N',
                Cell: (tableProps:any)=>{
                  return <>
                  {tableProps.row.index+1}
                  </>
              }
              },
      ...columns,
      {
        id:'images',
        Header: "Image",
        Cell: (tableProp:any)=>(
          <>
          <img style={{'width':'50px','height':'50px'}} src={tableProp.row.original.image?tableProp.row.original.image:''} />
          </>
        )
      },
      {
        id: "Click to Edit",
        Header: "Click to Edit",
        Cell: ({ row }:any) => (
          <TableView
            onClick={() => {
              // setId(row.values.id);
              setIsOpenUpdate(true)
              setCurrentData(row.original)
            }}
          >
            Edit
          </TableView>
        ),
      },
      {
        id: "Click to Delete",
        Header: "Click to Delete",
        Cell: ({ row }:any) => (
          <TableReject
            onClick={() => {
              if(row.original?.id){
                deleteExecutive(row.original.id)
              }
            }}
          >
            Delete
          </TableReject>
        ),
      },
        ])
    }

    return (
        <div>
            <Loading loading={deleteing||isLoading} />
<OffCanvas  
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <CreateOurExcutiveModal/>
      </OffCanvas>

    

      <OffCanvas  
        size={isMobileScreen ? 100 : 50}
        btnClick={() => null}
        setIsOpen={setIsOpenUpdate}
        isOpen={isOpenupdate}
      >
        <UpdateOurExcutiveModal
        data={currentData}
        />
      </OffCanvas>

      {/*  */}
{/*  */}
            
            <Button styleType={"sec"} onClick={() => {
                setIsOpen(true)
            }}>
        Create EXECUTIVE
      </Button>

      <Tables
      tableColumn={columnsExcutive}
      tableData={
        data?data:[]
        // []
      }
      customHooks={[tableHooks]}
      />
        </div>
    )
}

export default OurExcutive